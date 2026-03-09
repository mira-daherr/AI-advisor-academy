import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
            scope: ['profile', 'email'],
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const name = profile.displayName;
                const googleId = profile.id;

                if (!email) {
                    return done(new Error('No email returned from Google'), undefined);
                }

                // Check if user already exists
                let user = await User.findOne({ $or: [{ googleId }, { email }] });

                if (user) {
                    // Link Google ID if logging in with an existing email account
                    if (!user.googleId) {
                        user.googleId = googleId;
                        await user.save();
                    }
                    return done(null, user);
                }

                // Create new user from Google profile
                user = await User.create({
                    name,
                    email,
                    googleId,
                    // No password for OAuth users
                });

                return done(null, user);
            } catch (error: any) {
                return done(error, undefined);
            }
        }
    )
);

// Serialize/deserialize only needed if using sessions, but we use JWT cookies
passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id).select('-password');
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
