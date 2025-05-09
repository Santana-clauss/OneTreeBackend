const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Gallery } = require('./models');

dotenv.config();

const galleryData = [
  {
    src: "/placeholder.svg?height=600&width=800&text=Award+Ceremony",
    alt: "Award ceremony",
    caption: "Recognition ceremony for schools that have planted the most trees this year"
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=School+Visit",
    alt: "School visit",
    caption: "Our team visiting Eldoret National Polytechnic to discuss future collaborations"
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Community+Engagement",
    alt: "Community engagement session",
    caption: "Community engagement session on the importance of forest conservation"
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Seedling+Distribution",
    alt: "Seedling distribution",
    caption: "Distribution of tree seedlings to local schools for their planting programs"
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Environmental+Workshop",
    alt: "Environmental workshop",
    caption: "Environmental education workshop for teachers and community leaders"
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Tree+Planting+Event+1",
    alt: "Large tree planting event",
    caption: "Our annual tree planting event with over 500 participants from local schools"
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Eco+Club+Meeting",
    alt: "Eco-club meeting at school",
    caption: "An eco-club meeting at ACK Ziwa High School, discussing upcoming projects"
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Students+Planting+2",
    alt: "Students planting trees in rural area",
    caption: "Students from Kapkong High School participating in rural reforestation"
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Tree+Nursery+1",
    alt: "Tree nursery managed by women",
    caption: "Women tending to our tree nursery, growing seedlings for future planting events"
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Environmental+Education+1",
    alt: "Environmental education session",
    caption: "Our team conducting an environmental education session at Moi Girls High School"
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Community+Project+1",
    alt: "Community members participating in tree planting",
    caption: "Local community members joining our reforestation efforts"
  },
  {
    src: "/placeholder.svg?height=600&width=800&text=Students+Planting+1",
    alt: "Students planting trees at local school",
    caption: "Students from St. Joseph Girls planting trees during our annual event"
  }
];

async function seedGallery() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing gallery items
    await Gallery.deleteMany({});
    console.log('Cleared existing gallery items');

    // Insert new gallery items
    const result = await Gallery.create(galleryData);
    console.log(`Successfully seeded ${result.length} gallery items`);

  } catch (error) {
    console.error('Error seeding gallery:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

seedGallery();