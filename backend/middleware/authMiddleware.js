import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    console.log(userId);
    if (!userId)
      return res.status(401).json({ error: "Unauthorized. No userId found." });

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser)
      return res.status(401).json({ error: "Unauthorized. User not found." });

    // Sync with MongoDB
    let user = await User.findOne({ clerkUserId: clerkUser.id });
    if (!user) {
      user = new User({
        clerkUserId: clerkUser.id,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
        email: clerkUser.emailAddresses[0]?.emailAddress,
        role: clerkUser.publicMetadata?.role || "user",
      });
      await user.save();
    }

    req.user = {
      id: user._id,
      clerkUserId: user.clerkUserId,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ error: "Unauthorized request" });
  }
};
