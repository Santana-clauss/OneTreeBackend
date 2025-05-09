const projectsData = [
  {
    name: "St Joseph Girls Chepterit",
    trees: 2400,
    images: [
      { source: path.join(__dirname, 'initial-images', 'chepterit5.jpg'), filename: 'chepterit5.jpg' },
      { source: path.join(__dirname, 'initial-images', 'chepterit2.jpg'), filename: 'chepterit2.jpg' },
      { source: path.join(__dirname, 'initial-images', 'chepterit6.jpg'), filename: 'chepterit6.jpg' }
    ]
  },
  {
    name: "World Environmental Day - Landson Foundation",
    trees: 400,
    images: [
      { source: path.join(__dirname, 'initial-images', 'Erday.jpg'), filename: 'Erday.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Erday1.jpg'), filename: 'Erday1.jpg' },
      { source: path.join(__dirname, 'initial-images', 'erd5.jpg'), filename: 'erd5.jpg' }
    ]
  },
  {
    name: "ACK Ziwa High School",
    trees: 500,
    images: [
      { source: path.join(__dirname, 'initial-images', 'ACK Ziwa 1.jpg'), filename: 'ACK Ziwa 1.jpg' },
      { source: path.join(__dirname, 'initial-images', 'ACK Ziwa 2.jpg'), filename: 'ACK Ziwa 2.jpg' },
      { source: path.join(__dirname, 'initial-images', 'ACK Ziwa 3.jpg'), filename: 'ACK Ziwa 3.jpg' }
    ]
  },
  {
    name: "Moi Girls High School",
    trees: 1200,
    images: [
      { source: path.join(__dirname, 'initial-images', 'Moi Girls 1.jpg'), filename: 'Moi Girls 1.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Moi Girls 2.jpg'), filename: 'Moi Girls 2.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Moi Girls 3.jpg'), filename: 'Moi Girls 3.jpg' }
    ]
  },
  {
    name: "Kapkong High School",
    trees: 1600,
    images: [
      { source: path.join(__dirname, 'initial-images', 'Kapkong 1.jpg'), filename: 'Kapkong 1.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Kapkong 2.jpg'), filename: 'Kapkong 2.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Kapkong 3.jpg'), filename: 'Kapkong 3.jpg' }
    ]
  },
  {
    name: "Nelson Mandela Day - Moi University Primary School",
    trees: 800,
    images: [
      { source: path.join(__dirname, 'initial-images', 'moiuni.jpg'), filename: 'moiuni.jpg' },
      { source: path.join(__dirname, 'initial-images', 'moiuni1.jpg'), filename: 'moiuni1.jpg' },
      { source: path.join(__dirname, 'initial-images', 'moiuni3.jpg'), filename: 'moiuni3.jpg' }
    ]
  },
  {
    name: "Eldoret National Polytechnic",
    trees: 1000,
    images: [
      { source: path.join(__dirname, 'initial-images', 'Eldoret Poly 1.jpg'), filename: 'Eldoret Poly 1.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Eldoret Poly 2.jpg'), filename: 'Eldoret Poly 2.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Eldoret Poly 3.jpg'), filename: 'Eldoret Poly 3.jpg' }
    ]
  },
  {
    name: "Kapsabet Girls High School",
    trees: 1800,
    images: [
      { source: path.join(__dirname, 'initial-images', 'Kapsabet Girls 1.jpg'), filename: 'Kapsabet Girls 1.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Kapsabet Girls 2.jpg'), filename: 'Kapsabet Girls 2.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Kapsabet Girls 3.jpg'), filename: 'Kapsabet Girls 3.jpg' }
    ]
  },
  {
    name: "Kitale National Polytechnic",
    trees: 700,
    images: [
      { source: path.join(__dirname, 'initial-images', 'Kitale Poly 1.jpg'), filename: 'Kitale Poly 1.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Kitale Poly 2.jpg'), filename: 'Kitale Poly 2.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Kitale Poly 3.jpg'), filename: 'Kitale Poly 3.jpg' }
    ]
  },
  {
    name: "University of Eldoret",
    trees: 2000,
    images: [
      { source: path.join(__dirname, 'initial-images', 'UoE 1.jpg'), filename: 'UoE 1.jpg' },
      { source: path.join(__dirname, 'initial-images', 'UoE 2.jpg'), filename: 'UoE 2.jpg' },
      { source: path.join(__dirname, 'initial-images', 'UoE 3.jpg'), filename: 'UoE 3.jpg' }
    ]
  },
  {
    name: "Moi University Main Campus",
    trees: 2500,
    images: [
      { source: path.join(__dirname, 'initial-images', 'Moi Uni 1.jpg'), filename: 'Moi Uni 1.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Moi Uni 2.jpg'), filename: 'Moi Uni 2.jpg' },
      { source: path.join(__dirname, 'initial-images', 'Moi Uni 3.jpg'), filename: 'Moi Uni 3.jpg' }
    ]
  },
  {
    name: "Kesses Secondary School",
    trees: 600,
    images: [
      { source: path.join(__dirname, 'initial-images', '1746816088412-kgvp54oaz8i.jpg'), filename: '1746816088412-kgvp54oaz8i.jpg' },
      { source: path.join(__dirname, 'initial-images', 'community(1).jpg'), filename: 'community(1).jpg' }
    ]
  }
];


async function seedProjects() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/onetr', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Project.deleteMany({});
    await Project.insertMany(projectsData);

    console.log('Projects seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
}

seedProjects();
