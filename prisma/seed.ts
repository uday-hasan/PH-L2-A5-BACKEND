import "dotenv/config";
import {
  PrismaClient,
  Role,
  EventVisibility,
  ParticipationStatus,
  InvitationStatus,
  PaymentStatus,
} from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Helper to generate slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper to hash password
async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

// Helper to create date for testing
function createDate(daysFromNow: number, hour: number = 10) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function main() {
  console.log("🌱 Starting database seeding...\n");

  // Clear existing data (optional - comment out to keep existing data)
  // await prisma.review.deleteMany({});
  // await prisma.payment.deleteMany({});
  // await prisma.invitation.deleteMany({});
  // await prisma.participation.deleteMany({});
  // await prisma.event.deleteMany({});
  // await prisma.user.deleteMany({});

  // ===== CREATE USERS =====
  console.log("👥 Creating users...");

  const users = [
    {
      email: "admin@planora.com",
      name: "Planora Admin",
      password: await hashPassword("Admin@123"),
      role: Role.ADMIN,
    },
    {
      email: "user1@planora.com",
      name: "Ahmed Hassan",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "user2@planora.com",
      name: "Fatima Khan",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "user3@planora.com",
      name: "Raj Patel",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "user4@planora.com",
      name: "Sarah Williams",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "user5@planora.com",
      name: "Mohammad Ali",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "user6@planora.com",
      name: "Jessica Chen",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "organizer@planora.com",
      name: "Event Organizer Pro",
      password: await hashPassword("Organizer@123"),
      role: Role.USER,
    },
    // Additional users for more data
    {
      email: "priya@planora.com",
      name: "Priya Sharma",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "dev.john@planora.com",
      name: "John Developer",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "designer.mike@planora.com",
      name: "Mike Designer",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "emma.startup@planora.com",
      name: "Emma Startup",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "alex.mentor@planora.com",
      name: "Alex Mentor",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "sophia.investor@planora.com",
      name: "Sophia Investor",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "david.engineer@planora.com",
      name: "David Engineer",
      password: await hashPassword("User@123"),
      role: Role.USER,
    },
    {
      email: "sophia.organizer@planora.com",
      name: "Sophia Organizer",
      password: await hashPassword("Organizer@123"),
      role: Role.USER,
    },
  ];

  const createdUsers: any[] = [];
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      const newUser = await prisma.user.create({ data: user });
      createdUsers.push(newUser);
      console.log(`   ✓ Created ${user.email}`);
    } else {
      createdUsers.push(existingUser);
      console.log(`   ⊝ ${user.email} already exists`);
    }
  }

  const admin = createdUsers[0];
  const user1 = createdUsers[1];
  const user2 = createdUsers[2];
  const user3 = createdUsers[3];
  const user4 = createdUsers[4];
  const user5 = createdUsers[5];
  const user6 = createdUsers[6];
  const organizer = createdUsers[7];
  const priya = createdUsers[8];
  const john = createdUsers[9];
  const mike = createdUsers[10];
  const emma = createdUsers[11];
  const alex = createdUsers[12];
  const sophia = createdUsers[13];
  const david = createdUsers[14];
  const sophia_org = createdUsers[15];

  // ===== CREATE EVENTS =====
  console.log("\n📅 Creating events...");

  const eventData = [
    // PUBLIC FREE EVENTS - FEATURED & UPCOMING
    {
      title: "Tech Summit 2025",
      description:
        "Annual technology summit with keynote speakers from top tech companies discussing innovation and future trends in AI, Cloud, and Web3.",
      venue: "Dhaka Convention Center",
      eventLink: "https://techsummit2025.com",
      date: createDate(45),
      time: "10:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      isFeatured: true,
      organizerId: admin.id,
    },
    {
      title: "JavaScript Basics Workshop",
      description:
        "Learn JavaScript fundamentals including variables, functions, and DOM manipulation with hands-on exercises.",
      venue: "Tech Hub, Gulshan",
      eventLink: "https://js-workshop.dev",
      date: createDate(15),
      time: "2:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: user1.id,
    },
    {
      title: "Web Development Meetup",
      description:
        "Monthly meetup for web developers to share experiences, discuss best practices, and network with peers.",
      venue: "Cafe Tech, Banani",
      date: createDate(8),
      time: "6:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: user2.id,
    },
    {
      title: "AI & Machine Learning Talk",
      description:
        "Exploring recent advancements in AI and machine learning with industry experts sharing real-world applications.",
      venue: "Innovation Hub, Mohakhali",
      date: createDate(20),
      time: "3:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: organizer.id,
    },
    {
      title: "Open Source Contribution Guide",
      description:
        "Beginner-friendly session on how to contribute to open-source projects and join the developer community.",
      venue: "Community Center, Dhanmondi",
      date: createDate(22),
      time: "4:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: user3.id,
    },
    {
      title: "CSS Grid & Flexbox Mastery",
      description:
        "Deep dive into modern CSS layout techniques with practical examples and live coding sessions.",
      venue: "Tech Academy, Gulshan",
      date: createDate(12),
      time: "11:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: john.id,
    },
    {
      title: "Node.js Runtime Internals",
      description:
        "Understand how Node.js works under the hood, event loop, and performance optimization techniques.",
      venue: "Developer Hub, Banani",
      date: createDate(18),
      time: "4:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: david.id,
    },
    {
      title: "Database Design Workshop",
      description:
        "Learn relational and NoSQL database design patterns, indexing, and query optimization.",
      venue: "Tech Center, Motijheel",
      date: createDate(25),
      time: "2:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: user2.id,
    },
    {
      title: "Testing & Quality Assurance",
      description:
        "Complete guide to unit testing, integration testing, and end-to-end testing best practices.",
      venue: "QA Lab, Gulshan",
      date: createDate(30),
      time: "10:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: user4.id,
    },

    // PUBLIC PAID EVENTS
    {
      title: "Startup Pitch Night",
      description:
        "Pitch your startup idea to top investors and venture capitalists. Get feedback from industry leaders.",
      venue: "Radisson Blu, Dhaka",
      date: createDate(30),
      time: "6:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 500,
      organizerId: admin.id,
    },
    {
      title: "Advanced React Course",
      description:
        "In-depth React training covering hooks, context API, state management, and performance optimization.",
      venue: "Tech Academy, Gulshan",
      date: createDate(25),
      time: "9:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 1500,
      organizerId: user1.id,
    },
    {
      title: "Full-Stack Development Bootcamp",
      description:
        "12-week intensive bootcamp covering frontend, backend, databases, and deployment best practices.",
      venue: "Dev Camp, Banani",
      date: createDate(35),
      time: "10:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 5000,
      organizerId: user2.id,
    },
    {
      title: "UX/UI Design Workshop",
      description:
        "Learn design principles, wireframing, prototyping, and user testing with hands-on projects.",
      venue: "Design Studio, Gulshan",
      date: createDate(28),
      time: "2:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 800,
      organizerId: mike.id,
    },
    {
      title: "DevOps & Cloud Deployment",
      description:
        "Master AWS, Docker, Kubernetes, and CI/CD pipelines for modern application deployment.",
      venue: "Cloud Center, Mohakhali",
      date: createDate(40),
      time: "11:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 2000,
      organizerId: organizer.id,
    },
    {
      title: "GraphQL Advanced Techniques",
      description:
        "Learn advanced GraphQL patterns, caching strategies, subscriptions, and real-time applications.",
      venue: "API Academy, Gulshan",
      date: createDate(33),
      time: "1:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 1200,
      organizerId: john.id,
    },
    {
      title: "Microservices Architecture",
      description:
        "Design and implement scalable microservices with service discovery, load balancing, and monitoring.",
      venue: "Enterprise Hub, Motijheel",
      date: createDate(42),
      time: "9:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 2500,
      organizerId: david.id,
    },
    {
      title: "Security Best Practices",
      description:
        "Comprehensive guide to web security, authentication, authorization, and protecting against common vulnerabilities.",
      venue: "Security Institute, Banani",
      date: createDate(38),
      time: "3:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 1800,
      organizerId: alex.id,
    },
    {
      title: "Mobile App Development Intensive",
      description: "Build native and cross-platform mobile apps using React Native and Flutter.",
      venue: "Mobile Lab, Gulshan",
      date: createDate(36),
      time: "10:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 3000,
      organizerId: emma.id,
    },

    // PRIVATE FREE EVENTS
    {
      title: "Private Networking Dinner",
      description:
        "An exclusive networking dinner for industry leaders and business professionals.",
      venue: "Pan Pacific Sonargaon",
      date: createDate(50),
      time: "7:00 PM",
      visibility: EventVisibility.PRIVATE,
      registrationFee: 0,
      organizerId: admin.id,
    },
    {
      title: "Team Building Activity",
      description: "Internal team building event with games, activities, and bonding sessions.",
      venue: "Team Office, Gulshan",
      date: createDate(12),
      time: "5:00 PM",
      visibility: EventVisibility.PRIVATE,
      registrationFee: 0,
      organizerId: user1.id,
    },
    {
      title: "Book Club Discussion",
      description:
        "Monthly book club for tech professionals to discuss the latest tech and business books.",
      venue: "Library Cafe, Dhanmondi",
      date: createDate(18),
      time: "6:30 PM",
      visibility: EventVisibility.PRIVATE,
      registrationFee: 0,
      organizerId: user3.id,
    },
    {
      title: "Founder's Circle",
      description:
        "Exclusive meetup for startup founders to discuss challenges, strategies, and collaboration opportunities.",
      venue: "StartupHub, Banani",
      date: createDate(24),
      time: "6:00 PM",
      visibility: EventVisibility.PRIVATE,
      registrationFee: 0,
      organizerId: sophia_org.id,
    },

    // PRIVATE PAID EVENTS
    {
      title: "VIP Leadership Summit",
      description:
        "Exclusive summit for C-level executives with world-class speakers and networking opportunities.",
      venue: "5-Star Hotel, Motijheel",
      date: createDate(55),
      time: "8:00 AM",
      visibility: EventVisibility.PRIVATE,
      registrationFee: 5000,
      organizerId: admin.id,
    },
    {
      title: "Executive Coaching Session",
      description: "One-on-one coaching sessions with industry mentors for career advancement.",
      venue: "Executive Office, Gulshan",
      date: createDate(32),
      time: "10:00 AM",
      visibility: EventVisibility.PRIVATE,
      registrationFee: 3000,
      organizerId: user2.id,
    },
    {
      title: "Investment Strategy Webinar",
      description: "Learn investment strategies and financial planning from expert advisors.",
      venue: "Online",
      eventLink: "https://investment-webinar.com",
      date: createDate(38),
      time: "3:00 PM",
      visibility: EventVisibility.PRIVATE,
      registrationFee: 2500,
      organizerId: sophia.id,
    },
    {
      title: "Entrepreneur's Mastermind Group",
      description:
        "Private mastermind group for entrepreneurs to share ideas and support each other's businesses.",
      venue: "Co-working Space, Banani",
      date: createDate(42),
      time: "6:00 PM",
      visibility: EventVisibility.PRIVATE,
      registrationFee: 1000,
      organizerId: organizer.id,
    },
    {
      title: "Private Tech Roundtable",
      description:
        "Intimate roundtable discussion with tech leaders about emerging technologies and industry trends.",
      venue: "Premium Club, Gulshan",
      date: createDate(48),
      time: "7:00 PM",
      visibility: EventVisibility.PRIVATE,
      registrationFee: 3500,
      organizerId: sophia_org.id,
    },

    // PAST EVENTS (for review testing)
    {
      title: "Q1 Tech Conference 2026",
      description: "First quarter tech conference with amazing speakers and networking.",
      venue: "Convention Center, Dhaka",
      date: createDate(-10),
      time: "9:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: admin.id,
    },
    {
      title: "React Fundamentals Workshop",
      description: "Beginner React workshop that happened last month.",
      venue: "Tech Hub, Gulshan",
      date: createDate(-15),
      time: "2:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 500,
      organizerId: user1.id,
    },
    {
      title: "Web Performance Optimization",
      description:
        "Learn techniques to optimize web application performance and reduce load times.",
      venue: "Performance Lab, Banani",
      date: createDate(-20),
      time: "10:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: john.id,
    },
    {
      title: "TypeScript Masterclass",
      description: "Complete guide to TypeScript with advanced patterns and real-world examples.",
      venue: "Tech Academy, Gulshan",
      date: createDate(-7),
      time: "2:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 800,
      organizerId: david.id,
    },
    {
      title: "Accessibility in Web Design",
      description: "Make your web applications accessible to everyone with WCAG compliance.",
      venue: "Accessible Design Center, Gulshan",
      date: createDate(-5),
      time: "11:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: mike.id,
    },
    {
      title: "Python for Data Science",
      description: "Learn data analysis, visualization, and machine learning with Python.",
      venue: "Data Lab, Motijheel",
      date: createDate(-3),
      time: "9:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 1500,
      organizerId: priya.id,
    },
  ];

  const createdEvents: any[] = [];
  for (const event of eventData) {
    const slug = generateSlug(event.title);
    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    });

    if (!existingEvent) {
      const newEvent = await prisma.event.create({
        data: { ...event, slug },
      });
      createdEvents.push(newEvent);
      console.log(`   ✓ Created "${event.title}"`);
    } else {
      createdEvents.push(existingEvent);
      console.log(`   ⊝ "${event.title}" already exists`);
    }
  }

  // ===== CREATE PARTICIPATIONS =====
  console.log("\n👥 Creating participations...");

  const participationData = [
    // Tech Summit participations
    { userId: user1.id, eventId: createdEvents[0].id, status: ParticipationStatus.APPROVED },
    { userId: user2.id, eventId: createdEvents[0].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[0].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[0].id, status: ParticipationStatus.APPROVED },
    { userId: user5.id, eventId: createdEvents[0].id, status: ParticipationStatus.APPROVED },
    { userId: priya.id, eventId: createdEvents[0].id, status: ParticipationStatus.APPROVED },
    { userId: john.id, eventId: createdEvents[0].id, status: ParticipationStatus.APPROVED },
    { userId: david.id, eventId: createdEvents[0].id, status: ParticipationStatus.APPROVED },

    // JavaScript Workshop
    { userId: user2.id, eventId: createdEvents[1].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[1].id, status: ParticipationStatus.APPROVED },
    { userId: mike.id, eventId: createdEvents[1].id, status: ParticipationStatus.APPROVED },
    { userId: priya.id, eventId: createdEvents[1].id, status: ParticipationStatus.APPROVED },

    // Web Dev Meetup
    { userId: user1.id, eventId: createdEvents[2].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[2].id, status: ParticipationStatus.APPROVED },
    { userId: john.id, eventId: createdEvents[2].id, status: ParticipationStatus.APPROVED },
    { userId: david.id, eventId: createdEvents[2].id, status: ParticipationStatus.APPROVED },

    // AI & ML Talk
    { userId: user1.id, eventId: createdEvents[3].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[3].id, status: ParticipationStatus.APPROVED },
    { userId: priya.id, eventId: createdEvents[3].id, status: ParticipationStatus.APPROVED },
    { userId: emma.id, eventId: createdEvents[3].id, status: ParticipationStatus.APPROVED },

    // Open Source Guide
    { userId: user2.id, eventId: createdEvents[4].id, status: ParticipationStatus.APPROVED },
    { userId: user5.id, eventId: createdEvents[4].id, status: ParticipationStatus.APPROVED },
    { userId: alex.id, eventId: createdEvents[4].id, status: ParticipationStatus.APPROVED },

    // CSS Grid & Flexbox
    { userId: user1.id, eventId: createdEvents[5].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[5].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[5].id, status: ParticipationStatus.APPROVED },
    { userId: mike.id, eventId: createdEvents[5].id, status: ParticipationStatus.APPROVED },
    { userId: emma.id, eventId: createdEvents[5].id, status: ParticipationStatus.APPROVED },

    // Node.js Runtime
    { userId: user2.id, eventId: createdEvents[6].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[6].id, status: ParticipationStatus.APPROVED },
    { userId: john.id, eventId: createdEvents[6].id, status: ParticipationStatus.APPROVED },
    { userId: alex.id, eventId: createdEvents[6].id, status: ParticipationStatus.APPROVED },

    // Database Design
    { userId: user1.id, eventId: createdEvents[7].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[7].id, status: ParticipationStatus.APPROVED },
    { userId: priya.id, eventId: createdEvents[7].id, status: ParticipationStatus.APPROVED },

    // Testing & QA
    { userId: user2.id, eventId: createdEvents[8].id, status: ParticipationStatus.APPROVED },
    { userId: user5.id, eventId: createdEvents[8].id, status: ParticipationStatus.APPROVED },
    { userId: david.id, eventId: createdEvents[8].id, status: ParticipationStatus.APPROVED },

    // Startup Pitch Night (paid)
    { userId: user1.id, eventId: createdEvents[9].id, status: ParticipationStatus.APPROVED },
    { userId: emma.id, eventId: createdEvents[9].id, status: ParticipationStatus.APPROVED },
    { userId: sophia.id, eventId: createdEvents[9].id, status: ParticipationStatus.APPROVED },

    // Advanced React (paid)
    { userId: user2.id, eventId: createdEvents[10].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[10].id, status: ParticipationStatus.APPROVED },
    { userId: john.id, eventId: createdEvents[10].id, status: ParticipationStatus.APPROVED },

    // Full-Stack Bootcamp (paid)
    { userId: user3.id, eventId: createdEvents[11].id, status: ParticipationStatus.APPROVED },
    { userId: user5.id, eventId: createdEvents[11].id, status: ParticipationStatus.APPROVED },
    { userId: alex.id, eventId: createdEvents[11].id, status: ParticipationStatus.APPROVED },

    // UX/UI Design Workshop (paid)
    { userId: user1.id, eventId: createdEvents[12].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[12].id, status: ParticipationStatus.APPROVED },
    { userId: mike.id, eventId: createdEvents[12].id, status: ParticipationStatus.APPROVED },

    // DevOps & Cloud (paid)
    { userId: user2.id, eventId: createdEvents[13].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[13].id, status: ParticipationStatus.APPROVED },
    { userId: david.id, eventId: createdEvents[13].id, status: ParticipationStatus.APPROVED },

    // GraphQL Advanced (paid)
    { userId: user1.id, eventId: createdEvents[14].id, status: ParticipationStatus.APPROVED },
    { userId: user5.id, eventId: createdEvents[14].id, status: ParticipationStatus.APPROVED },

    // Microservices (paid)
    { userId: user3.id, eventId: createdEvents[15].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[15].id, status: ParticipationStatus.APPROVED },
    { userId: david.id, eventId: createdEvents[15].id, status: ParticipationStatus.APPROVED },

    // Security Best Practices (paid)
    { userId: user2.id, eventId: createdEvents[16].id, status: ParticipationStatus.APPROVED },
    { userId: alex.id, eventId: createdEvents[16].id, status: ParticipationStatus.APPROVED },

    // Mobile App Development (paid)
    { userId: user1.id, eventId: createdEvents[17].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[17].id, status: ParticipationStatus.APPROVED },
    { userId: emma.id, eventId: createdEvents[17].id, status: ParticipationStatus.APPROVED },

    // Private events
    { userId: user2.id, eventId: createdEvents[19].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[19].id, status: ParticipationStatus.PENDING },
    { userId: user5.id, eventId: createdEvents[19].id, status: ParticipationStatus.REJECTED },

    { userId: user1.id, eventId: createdEvents[20].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[20].id, status: ParticipationStatus.APPROVED },

    { userId: user2.id, eventId: createdEvents[21].id, status: ParticipationStatus.PENDING },
    { userId: user4.id, eventId: createdEvents[21].id, status: ParticipationStatus.APPROVED },

    { userId: emma.id, eventId: createdEvents[22].id, status: ParticipationStatus.APPROVED },
    { userId: alex.id, eventId: createdEvents[22].id, status: ParticipationStatus.APPROVED },

    // Private paid events
    { userId: user2.id, eventId: createdEvents[23].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[23].id, status: ParticipationStatus.PENDING },

    { userId: user1.id, eventId: createdEvents[24].id, status: ParticipationStatus.APPROVED },
    { userId: user5.id, eventId: createdEvents[24].id, status: ParticipationStatus.APPROVED },

    { userId: sophia.id, eventId: createdEvents[25].id, status: ParticipationStatus.APPROVED },

    { userId: emma.id, eventId: createdEvents[26].id, status: ParticipationStatus.APPROVED },
    { userId: alex.id, eventId: createdEvents[26].id, status: ParticipationStatus.APPROVED },

    { userId: sophia_org.id, eventId: createdEvents[27].id, status: ParticipationStatus.APPROVED },
    { userId: alex.id, eventId: createdEvents[27].id, status: ParticipationStatus.PENDING },

    // Past events for reviews
    { userId: user1.id, eventId: createdEvents[28].id, status: ParticipationStatus.APPROVED },
    { userId: user2.id, eventId: createdEvents[28].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[28].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[28].id, status: ParticipationStatus.APPROVED },
    { userId: user5.id, eventId: createdEvents[28].id, status: ParticipationStatus.APPROVED },
    { userId: priya.id, eventId: createdEvents[28].id, status: ParticipationStatus.APPROVED },

    { userId: user1.id, eventId: createdEvents[29].id, status: ParticipationStatus.APPROVED },
    { userId: user2.id, eventId: createdEvents[29].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[29].id, status: ParticipationStatus.APPROVED },

    { userId: john.id, eventId: createdEvents[30].id, status: ParticipationStatus.APPROVED },
    { userId: david.id, eventId: createdEvents[30].id, status: ParticipationStatus.APPROVED },
    { userId: alex.id, eventId: createdEvents[30].id, status: ParticipationStatus.APPROVED },

    { userId: user2.id, eventId: createdEvents[31].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[31].id, status: ParticipationStatus.APPROVED },
    { userId: user5.id, eventId: createdEvents[31].id, status: ParticipationStatus.APPROVED },

    { userId: mike.id, eventId: createdEvents[32].id, status: ParticipationStatus.APPROVED },
    { userId: emma.id, eventId: createdEvents[32].id, status: ParticipationStatus.APPROVED },
  ];

  let participationCount = 0;
  for (const participation of participationData) {
    const exists = await prisma.participation.findUnique({
      where: {
        userId_eventId: {
          userId: participation.userId,
          eventId: participation.eventId,
        },
      },
    });

    if (!exists) {
      await prisma.participation.create({ data: participation });
      participationCount++;
    }
  }
  console.log(`   ✓ Created ${participationCount} participations`);

  // ===== CREATE INVITATIONS =====
  console.log("\n📧 Creating invitations...");

  const invitationData = [
    // Admin invitations
    {
      senderId: admin.id,
      receiverId: user4.id,
      eventId: createdEvents[19].id,
      status: InvitationStatus.PENDING,
    },
    {
      senderId: admin.id,
      receiverId: user5.id,
      eventId: createdEvents[19].id,
      status: InvitationStatus.ACCEPTED,
    },
    {
      senderId: admin.id,
      receiverId: priya.id,
      eventId: createdEvents[23].id,
      status: InvitationStatus.ACCEPTED,
    },

    // User invitations to paid events
    {
      senderId: user2.id,
      receiverId: user1.id,
      eventId: createdEvents[12].id,
      status: InvitationStatus.PENDING,
    },
    {
      senderId: user1.id,
      receiverId: user3.id,
      eventId: createdEvents[12].id,
      status: InvitationStatus.ACCEPTED,
    },
    {
      senderId: organizer.id,
      receiverId: user2.id,
      eventId: createdEvents[26].id,
      status: InvitationStatus.ACCEPTED,
    },
    {
      senderId: user5.id,
      receiverId: user4.id,
      eventId: createdEvents[25].id,
      status: InvitationStatus.DECLINED,
    },

    // More invitations to private events
    {
      senderId: sophia_org.id,
      receiverId: emma.id,
      eventId: createdEvents[22].id,
      status: InvitationStatus.ACCEPTED,
    },
    {
      senderId: sophia_org.id,
      receiverId: david.id,
      eventId: createdEvents[22].id,
      status: InvitationStatus.PENDING,
    },
    {
      senderId: user3.id,
      receiverId: priya.id,
      eventId: createdEvents[21].id,
      status: InvitationStatus.PENDING,
    },
  ];

  let invitationCount = 0;
  for (const invitation of invitationData) {
    const exists = await prisma.invitation.findFirst({
      where: {
        AND: [{ receiverId: invitation.receiverId }, { eventId: invitation.eventId }],
      },
    });

    if (!exists) {
      await prisma.invitation.create({ data: invitation });
      invitationCount++;
    }
  }
  console.log(`   ✓ Created ${invitationCount} invitations`);

  // ===== CREATE REVIEWS =====
  console.log("\n⭐ Creating reviews...");

  const reviewData = [
    // Q1 Tech Conference reviews
    {
      userId: user1.id,
      eventId: createdEvents[28].id,
      rating: 5,
      comment: "Excellent conference! Great speakers and well-organized. Highly recommend!",
    },
    {
      userId: user2.id,
      eventId: createdEvents[28].id,
      rating: 4,
      comment: "Really good event. Could have had more interactive sessions but overall great.",
    },
    {
      userId: user3.id,
      eventId: createdEvents[28].id,
      rating: 5,
      comment: "Outstanding! Best tech conference I've attended. Can't wait for the next one!",
    },
    {
      userId: user4.id,
      eventId: createdEvents[28].id,
      rating: 3,
      comment: "Good conference but a bit long. Would prefer shorter sessions.",
    },
    {
      userId: user5.id,
      eventId: createdEvents[28].id,
      rating: 4,
      comment: "Learned a lot! The networking was excellent.",
    },
    {
      userId: priya.id,
      eventId: createdEvents[28].id,
      rating: 5,
      comment: "Amazing event! The AI/ML sessions were particularly impressive.",
    },

    // React Fundamentals Workshop reviews
    {
      userId: user1.id,
      eventId: createdEvents[29].id,
      rating: 5,
      comment: "Great workshop! Instructor was very knowledgeable.",
    },
    {
      userId: user2.id,
      eventId: createdEvents[29].id,
      rating: 4,
      comment: "Good content but could use more advanced examples.",
    },
    {
      userId: user4.id,
      eventId: createdEvents[29].id,
      rating: 4,
      comment: "Well-structured workshop. Learned practical React patterns.",
    },

    // Web Performance Optimization reviews
    {
      userId: john.id,
      eventId: createdEvents[30].id,
      rating: 5,
      comment: "Fantastic session on performance optimization! Very practical.",
    },
    {
      userId: david.id,
      eventId: createdEvents[30].id,
      rating: 5,
      comment: "Best workshop I've attended this year. Highly recommend!",
    },
    {
      userId: alex.id,
      eventId: createdEvents[30].id,
      rating: 4,
      comment: "Great insights into web performance. Would love more real-world examples.",
    },

    // TypeScript Masterclass reviews
    {
      userId: user2.id,
      eventId: createdEvents[31].id,
      rating: 5,
      comment: "Comprehensive TypeScript course! Very well taught.",
    },
    {
      userId: user3.id,
      eventId: createdEvents[31].id,
      rating: 4,
      comment: "Good coverage of TypeScript basics and advanced patterns.",
    },
    {
      userId: user5.id,
      eventId: createdEvents[31].id,
      rating: 5,
      comment: "Exactly what I needed! Instructor was excellent.",
    },

    // Accessibility in Web Design reviews
    {
      userId: mike.id,
      eventId: createdEvents[32].id,
      rating: 5,
      comment: "Eye-opening session on web accessibility! Everyone should attend this.",
    },
    {
      userId: emma.id,
      eventId: createdEvents[32].id,
      rating: 4,
      comment: "Great insights into making web accessible. Very practical.",
    },

    // Web Dev Meetup review
    {
      userId: user1.id,
      eventId: createdEvents[2].id,
      rating: 5,
      comment:
        "Great meetup! Met awesome developers and learned new things. Looking forward to next month!",
    },

    // Additional reviews on past paid events
    {
      userId: user2.id,
      eventId: createdEvents[10].id,
      rating: 5,
      comment: "Advanced React was worth every penny! Highly recommend.",
    },
    {
      userId: user4.id,
      eventId: createdEvents[12].id,
      rating: 5,
      comment: "Best UX/UI workshop I've attended. Instructor was amazing!",
    },
    {
      userId: user3.id,
      eventId: createdEvents[11].id,
      rating: 4,
      comment: "Great bootcamp. Intense but rewarding learning experience.",
    },
    {
      userId: alex.id,
      eventId: createdEvents[13].id,
      rating: 5,
      comment: "DevOps training was top-notch. Very practical and industry-relevant.",
    },
  ];

  let reviewCount = 0;
  for (const review of reviewData) {
    const exists = await prisma.review.findUnique({
      where: {
        userId_eventId: {
          userId: review.userId,
          eventId: review.eventId,
        },
      },
    });

    if (!exists) {
      await prisma.review.create({ data: review });
      reviewCount++;
    }
  }
  console.log(`   ✓ Created ${reviewCount} reviews`);

  // ===== CREATE PAYMENTS =====
  console.log("\n💳 Creating payments...");

  const paymentData = [
    // Startup Pitch Night (500 BDT)
    {
      userId: user1.id,
      eventId: createdEvents[9].id,
      amount: 500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: emma.id,
      eventId: createdEvents[9].id,
      amount: 500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: sophia.id,
      eventId: createdEvents[9].id,
      amount: 500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Advanced React (1500 BDT)
    {
      userId: user2.id,
      eventId: createdEvents[10].id,
      amount: 1500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user4.id,
      eventId: createdEvents[10].id,
      amount: 1500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: john.id,
      eventId: createdEvents[10].id,
      amount: 1500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Full-Stack Bootcamp (5000 BDT)
    {
      userId: user3.id,
      eventId: createdEvents[11].id,
      amount: 5000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user5.id,
      eventId: createdEvents[11].id,
      amount: 5000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: alex.id,
      eventId: createdEvents[11].id,
      amount: 5000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // UX/UI Design Workshop (800 BDT)
    {
      userId: user1.id,
      eventId: createdEvents[12].id,
      amount: 800,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user4.id,
      eventId: createdEvents[12].id,
      amount: 800,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: mike.id,
      eventId: createdEvents[12].id,
      amount: 800,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // DevOps & Cloud Deployment (2000 BDT)
    {
      userId: user2.id,
      eventId: createdEvents[13].id,
      amount: 2000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user3.id,
      eventId: createdEvents[13].id,
      amount: 2000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: david.id,
      eventId: createdEvents[13].id,
      amount: 2000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // GraphQL Advanced (1200 BDT)
    {
      userId: user1.id,
      eventId: createdEvents[14].id,
      amount: 1200,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user5.id,
      eventId: createdEvents[14].id,
      amount: 1200,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Microservices (2500 BDT)
    {
      userId: user3.id,
      eventId: createdEvents[15].id,
      amount: 2500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user4.id,
      eventId: createdEvents[15].id,
      amount: 2500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: david.id,
      eventId: createdEvents[15].id,
      amount: 2500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Security Best Practices (1800 BDT)
    {
      userId: user2.id,
      eventId: createdEvents[16].id,
      amount: 1800,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: alex.id,
      eventId: createdEvents[16].id,
      amount: 1800,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Mobile App Development (3000 BDT)
    {
      userId: user1.id,
      eventId: createdEvents[17].id,
      amount: 3000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user4.id,
      eventId: createdEvents[17].id,
      amount: 3000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: emma.id,
      eventId: createdEvents[17].id,
      amount: 3000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Private VIP Leadership Summit (5000 BDT)
    {
      userId: user2.id,
      eventId: createdEvents[23].id,
      amount: 5000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user4.id,
      eventId: createdEvents[23].id,
      amount: 5000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Private Executive Coaching (3000 BDT)
    {
      userId: user1.id,
      eventId: createdEvents[24].id,
      amount: 3000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user5.id,
      eventId: createdEvents[24].id,
      amount: 3000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Investment Strategy (2500 BDT)
    {
      userId: sophia.id,
      eventId: createdEvents[25].id,
      amount: 2500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Entrepreneur's Mastermind (1000 BDT)
    {
      userId: emma.id,
      eventId: createdEvents[26].id,
      amount: 1000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: alex.id,
      eventId: createdEvents[26].id,
      amount: 1000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Private Tech Roundtable (3500 BDT)
    {
      userId: sophia_org.id,
      eventId: createdEvents[27].id,
      amount: 3500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: alex.id,
      eventId: createdEvents[27].id,
      amount: 3500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },

    // Past paid events
    {
      userId: user1.id,
      eventId: createdEvents[29].id,
      amount: 500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user2.id,
      eventId: createdEvents[29].id,
      amount: 500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user4.id,
      eventId: createdEvents[29].id,
      amount: 500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user2.id,
      eventId: createdEvents[31].id,
      amount: 800,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user3.id,
      eventId: createdEvents[31].id,
      amount: 800,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user5.id,
      eventId: createdEvents[31].id,
      amount: 800,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: priya.id,
      eventId: createdEvents[32].id,
      amount: 1500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
  ];

  let paymentCount = 0;
  for (const payment of paymentData) {
    const exists = await prisma.payment.findFirst({
      where: {
        AND: [
          { userId: payment.userId },
          { eventId: payment.eventId },
          { stripeSessionId: payment.stripeSessionId },
        ],
      },
    });

    if (!exists) {
      await prisma.payment.create({ data: payment });
      paymentCount++;
    }
  }
  console.log(`   ✓ Created ${paymentCount} payments`);

  // ===== SUMMARY =====
  console.log("\n✅ Seeding completed successfully!\n");
  console.log("📊 Summary:");
  console.log(`   Users: ${createdUsers.length} (8 original + 8 additional)`);
  console.log(
    `   Events: ${createdEvents.length} (9 free + 9 paid + 4 private free + 5 private paid + 5 past events)`,
  );
  console.log(`   Participations: ${participationCount || participationData.length}`);
  console.log(`   Invitations: ${invitationCount || invitationData.length}`);
  console.log(`   Reviews: ${reviewCount || reviewData.length}`);
  console.log(`   Payments: ${paymentCount || paymentData.length}`);
  console.log("\n🔑 Default Credentials:");
  console.log("   Admin    → admin@planora.com / Admin@123");
  console.log("   User 1   → user1@planora.com / User@123");
  console.log("   User 2   → user2@planora.com / User@123");
  console.log("   Organizer → organizer@planora.com / Organizer@123");
  console.log("   Organizer2 → sophia.organizer@planora.com / Organizer@123");
  console.log(
    "\n💡 Note: All created data is for testing purposes and includes various event types, statuses, and user interactions.\n",
  );
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
