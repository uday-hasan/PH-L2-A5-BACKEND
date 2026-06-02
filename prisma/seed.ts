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

// ================= HELPERS =================

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

function createDate(daysFromNow: number, hour: number = 10) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFee() {
  const fees = [0, 500, 800, 1200, 1500, 2000, 2500, 3000];
  return randomItem(fees);
}

// ================= STATIC POOLS =================

const venues = [
  "Tech Hub, Gulshan",
  "Innovation Center, Banani",
  "Developer Space, Dhanmondi",
  "Startup Arena, Mohakhali",
  "Cloud Lab, Motijheel",
  "Design Studio, Uttara",
  "AI Research Center, Farmgate",
  "Conference Hall, Bashundhara",
  "Co-working Space, Gulshan",
  "Training Center, Banani",
];

const eventTopics = [
  "React",
  "Next.js",
  "Node.js",
  "TypeScript",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "AI",
  "Machine Learning",
  "Cyber Security",
  "Web Performance",
  "System Design",
  "Cloud Computing",
  "DevOps",
  "UI/UX",
  "Mobile Development",
  "Backend Engineering",
  "Microservices",
  "Database Optimization",
  "Open Source",
];

const eventFormats = [
  "Workshop",
  "Bootcamp",
  "Meetup",
  "Conference",
  "Hackathon",
  "Masterclass",
  "Networking Session",
  "Seminar",
  "Training",
  "Roundtable",
];

const descriptions = [
  "Hands-on practical learning session with real-world examples and networking opportunities.",
  "Industry experts will share modern best practices, tools, and career guidance.",
  "Interactive event focused on collaboration, learning, and building production-ready skills.",
  "Deep dive into modern development workflows and scalable architecture patterns.",
  "Perfect for developers looking to improve technical expertise and connect with professionals.",
];

// ================= MAIN =================

async function main() {
  console.log("🌱 Starting database seeding...\n");

  // ================= USERS =================

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
    const existing = await prisma.user.findUnique({ where: { email: user.email } });

    if (existing) {
      createdUsers.push(existing);
    } else {
      const created = await prisma.user.create({ data: user });
      createdUsers.push(created);
    }
  }

  const [
    admin,
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    organizer,
    priya,
    john,
    mike,
    emma,
    alex,
    sophia,
    david,
    sophia_org,
  ] = createdUsers;

  // ================= BASE EVENTS =================

  const eventData: any[] = [
    {
      title: "Tech Summit 2025",
      description: "Annual tech summit",
      venue: "Dhaka Convention Center",
      date: createDate(45),
      time: "10:00 AM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      isFeatured: true,
      organizerId: admin.id,
    },
    {
      title: "JavaScript Workshop",
      description: "Learn JS basics",
      venue: "Tech Hub",
      date: createDate(15),
      time: "2:00 PM",
      visibility: EventVisibility.PUBLIC,
      registrationFee: 0,
      organizerId: user1.id,
    },
  ];

  // ================= AUTO 50+ EVENTS =================

  const additionalEvents = Array.from({ length: 50 }).map((_, i) => {
    const topic = randomItem(eventTopics);
    const format = randomItem(eventFormats);

    const day = randomItem([7, 14, 25]);

    const organizers = createdUsers;

    return {
      title: `${topic} ${format} ${i + 1}`,
      description: randomItem(descriptions),
      venue: randomItem(venues),
      date: createDate(day),
      time: `${Math.floor(Math.random() * 8) + 9}:00 ${Math.random() > 0.5 ? "AM" : "PM"}`,
      visibility: Math.random() > 0.3 ? EventVisibility.PUBLIC : EventVisibility.PRIVATE,
      registrationFee: randomFee(),
      isFeatured: Math.random() > 0.85,
      organizerId: randomItem(organizers).id,
    };
  });

  eventData.push(...additionalEvents);

  // ================= CREATE EVENTS =================

  const createdEvents: any[] = [];

  for (const event of eventData) {
    const slug = generateSlug(event.title);

    const existing = await prisma.event.findUnique({ where: { slug } });

    if (existing) {
      createdEvents.push(existing);
    } else {
      const created = await prisma.event.create({
        data: { ...event, slug },
      });
      createdEvents.push(created);
    }
  }

  // ================= PARTICIPATIONS =================

  const participationCount = await prisma.participation.count();

  // ================= INVITATIONS =================

  const invitationCount = await prisma.invitation.count();

  // ================= REVIEWS =================

  const reviewCount = await prisma.review.count();

  // ================= PAYMENTS (FIXED) =================

  const paymentData: any[] = [
    {
      userId: user1.id,
      eventId: createdEvents[0].id,
      amount: 500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_${Date.now()}`,
    },
  ];

  let paymentCount = 0;

  for (const payment of paymentData) {
    const exists = await prisma.payment.findFirst({
      where: {
        userId: payment.userId,
        eventId: payment.eventId,
      },
    });

    if (!exists) {
      await prisma.payment.create({ data: payment });
      paymentCount++;
    }
  }

  // ================= SUMMARY =================

  console.log("\n✅ Seeding completed!\n");

  console.log(`Users: ${createdUsers.length}`);
  console.log(`Events: ${createdEvents.length}`);
  console.log(`Payments: ${paymentCount}`);
  console.log(`Participations: ${participationCount}`);
  console.log(`Invitations: ${invitationCount}`);
  console.log(`Reviews: ${reviewCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
