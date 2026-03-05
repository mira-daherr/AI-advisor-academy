const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Questionnaire = require('../models/Questionnaire');
const Recommendation = require('../models/Recommendation');

dotenv.config();

const users = [
    {
        name: 'Free Student',
        email: 'free@test.com',
        password: 'password123',
        plan: 'free'
    },
    {
        name: 'Premium Scholar',
        email: 'premium@test.com',
        password: 'password123',
        plan: 'premium'
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/academic-advisor');
        console.log('Connected to DB...');

        await User.deleteMany({});
        await Questionnaire.deleteMany({});
        await Recommendation.deleteMany({});

        for (let u of users) {
            const hashedPassword = await bcrypt.hash(u.password, 10);
            const user = await User.create({ ...u, password: hashedPassword });

            // Sample Questionnaire
            const quest = await Questionnaire.create({
                userId: user._id,
                hobbies: ['Coding', 'Chess'],
                futureVision: 'Become a software architect',
                independence: 'Highly independent',
                grades: { math: 95, science: 90, language: 85, socialStudies: 80 },
                regions: ['North America', 'Europe'],
                budget: '$20k - $40k'
            });

            // Sample Recommendation
            await Recommendation.create({
                userId: user._id,
                academicStatement: 'A determined logical thinker with high technical potential.',
                majors: [
                    { name: 'Computer Science', reason: 'Strong math grades and interest in coding.', salaryRange: '$80k - $150k' }
                ],
                universities: [
                    { name: 'Stanford University', country: 'USA', ranking: '#2', tuition: '$55,000', reason: 'Top-tier CS program.' }
                ],
                scholarships: [
                    { name: 'Merit Scholarship', amount: '$10,000', eligibility: 'GPA > 3.8' }
                ],
                advice: 'Focus on building a strong portfolio.'
            });

            console.log(`Seeded user: ${u.email}`);
        }

        console.log('Seeding complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
