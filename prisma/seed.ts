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

  // ===== CREATE EVENTS =====
  console.log("\n📅 Creating events...");

  const eventData = [
    // PUBLIC FREE EVENTS
    {
      title: "Tech Summit 2025",
      description:
        "Annual technology summit with keynote speakers from top tech companies discussing innovation and future trends.",
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
      organizerId: user4.id,
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
      organizerId: user5.id,
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
    // User1 joined public free event
    { userId: user1.id, eventId: createdEvents[1].id, status: ParticipationStatus.APPROVED },
    // User2 joined public free event
    { userId: user2.id, eventId: createdEvents[2].id, status: ParticipationStatus.APPROVED },
    // User3 joined open source event
    { userId: user3.id, eventId: createdEvents[4].id, status: ParticipationStatus.APPROVED },
    // Multiple users joined tech summit
    { userId: user2.id, eventId: createdEvents[0].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[0].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[0].id, status: ParticipationStatus.APPROVED },
    // Pending participations (private events awaiting approval)
    { userId: user1.id, eventId: createdEvents[11].id, status: ParticipationStatus.PENDING },
    { userId: user2.id, eventId: createdEvents[11].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[12].id, status: ParticipationStatus.PENDING },
    { userId: user4.id, eventId: createdEvents[12].id, status: ParticipationStatus.APPROVED },
    // Rejected participations
    { userId: user5.id, eventId: createdEvents[11].id, status: ParticipationStatus.REJECTED },
    // Banned participant
    { userId: user6.id, eventId: createdEvents[0].id, status: ParticipationStatus.BANNED },
    // Paid events participations
    { userId: user1.id, eventId: createdEvents[5].id, status: ParticipationStatus.APPROVED },
    { userId: user2.id, eventId: createdEvents[6].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[7].id, status: ParticipationStatus.APPROVED },
    // Past events for reviews
    { userId: user1.id, eventId: createdEvents[17].id, status: ParticipationStatus.APPROVED },
    { userId: user2.id, eventId: createdEvents[17].id, status: ParticipationStatus.APPROVED },
    { userId: user3.id, eventId: createdEvents[17].id, status: ParticipationStatus.APPROVED },
    { userId: user4.id, eventId: createdEvents[18].id, status: ParticipationStatus.APPROVED },
    { userId: user5.id, eventId: createdEvents[18].id, status: ParticipationStatus.APPROVED },
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
    // Organizer inviting users
    {
      senderId: admin.id,
      receiverId: user4.id,
      eventId: createdEvents[11].id,
      status: InvitationStatus.PENDING,
    },
    {
      senderId: admin.id,
      receiverId: user5.id,
      eventId: createdEvents[11].id,
      status: InvitationStatus.ACCEPTED,
    },
    {
      senderId: user2.id,
      receiverId: user1.id,
      eventId: createdEvents[14].id,
      status: InvitationStatus.PENDING,
    },
    {
      senderId: organizer.id,
      receiverId: user2.id,
      eventId: createdEvents[16].id,
      status: InvitationStatus.ACCEPTED,
    },
    {
      senderId: user5.id,
      receiverId: user3.id,
      eventId: createdEvents[15].id,
      status: InvitationStatus.DECLINED,
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
    {
      userId: user1.id,
      eventId: createdEvents[18].id,
      rating: 5,
      comment: "Excellent conference! Great speakers and well-organized. Highly recommend!",
    },
    {
      userId: user2.id,
      eventId: createdEvents[18].id,
      rating: 4,
      comment: "Really good event. Could have had more interactive sessions but overall great.",
    },
    {
      userId: user3.id,
      eventId: createdEvents[18].id,
      rating: 5,
      comment: "Outstanding! Best tech conference I've attended. Can't wait for the next one!",
    },
    {
      userId: user4.id,
      eventId: createdEvents[18].id,
      rating: 3,
      comment:
        "Good workshop but a bit fast-paced. Would appreciate more time for hands-on practice.",
    },
    {
      userId: user5.id,
      eventId: createdEvents[18].id,
      rating: 4,
      comment:
        "Learned a lot! Instructor was knowledgeable. Some concepts could be explained more.",
    },
    {
      userId: user1.id,
      eventId: createdEvents[2].id,
      rating: 5,
      comment:
        "Great meetup! Met awesome developers and learned new things. Looking forward to next month!",
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
    {
      userId: user1.id,
      eventId: createdEvents[5].id,
      amount: 500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user2.id,
      eventId: createdEvents[6].id,
      amount: 1500,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user3.id,
      eventId: createdEvents[7].id,
      amount: 800,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user4.id,
      eventId: createdEvents[8].id,
      amount: 2000,
      status: PaymentStatus.PAID,
      stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
    },
    {
      userId: user1.id,
      eventId: createdEvents[18].id,
      amount: 500,
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
  console.log(`   Users: ${createdUsers.length}`);
  console.log(`   Events: ${createdEvents.length}`);
  console.log(`   Participations: ${participationCount || participationData.length}`);
  console.log(`   Invitations: ${invitationCount || invitationData.length}`);
  console.log(`   Reviews: ${reviewCount || reviewData.length}`);
  console.log(`   Payments: ${paymentCount || paymentData.length}`);
  console.log("\n🔑 Default Credentials:");
  console.log("   Admin    → admin@planora.com / Admin@123");
  console.log("   User 1   → user1@planora.com / User@123");
  console.log("   User 2   → user2@planora.com / User@123");
  console.log("   Organizer → organizer@planora.com / Organizer@123");
  console.log("\n💡 Note: All created data is for testing purposes.\n");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
