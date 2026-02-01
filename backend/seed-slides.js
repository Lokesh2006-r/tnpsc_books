require('dotenv').config();
const mongoose = require('mongoose');
const Slide = require('./models/Slide');

const slides = [
    {
        title: "Discover Best Selling Books",
        subtitle: "Up to 50% Off on Top Rated Books",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        order: 1
    },
    {
        title: "New Arrivals Collection",
        subtitle: "Check out the latest additions to our library",
        image: "https://images.unsplash.com/photo-1507842217121-9e93cc866e35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        order: 2
    },
    {
        title: "Academic & Professional",
        subtitle: "Resources for your career growth",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        order: 3
    },
    {
        title: "Children's Book Festival",
        subtitle: "Stories that inspire imagination",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        order: 4
    },
    {
        title: "Rare & Collectible",
        subtitle: "Find unique editions for your collection",
        image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        order: 5
    },
    {
        title: "Summer Reading List",
        subtitle: "Perfect companions for your vacation",
        image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        order: 6
    },
    {
        title: "Self Development",
        subtitle: "Invest in yourself today",
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        order: 7
    },
    {
        title: "Biographies & Memoirs",
        subtitle: "Lives that shaped history",
        image: "https://images.unsplash.com/photo-1526243741027-cdbe71e72acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        order: 8
    },
    {
        title: "Science Fiction & Fantasy",
        subtitle: "Explore new worlds",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        order: 9
    },
    {
        title: "History & Culture",
        subtitle: "Understand the past to shape the future",
        image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
        order: 10
    }
];

const seedSlides = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore');

        console.log('Connected to database...');

        // Clear existing slides
        await Slide.deleteMany({});
        console.log('Cleared existing slides');

        // Insert new slides
        await Slide.insertMany(slides);
        console.log(`Added ${slides.length} slides successfully`);

        process.exit();
    } catch (error) {
        console.error('Error seeding slides:', error);
        process.exit(1);
    }
};

seedSlides();
