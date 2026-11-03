import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Member } from '../models/Member.js';
import { Meeting } from '../models/Meeting.js';
import { Attendance } from '../models/Attendance.js';
import { SavingsTransaction } from '../models/Savings.js';
import { Loan } from '../models/Loan.js';
import { Product } from '../models/Product.js';
import { Announcement } from '../models/Announcement.js';
import { Group } from '../models/Group.js';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sakhisetu';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for seeding SakhiSetu demo data...');

    // Clear existing records
    await Promise.all([
      User.deleteMany({}),
      Member.deleteMany({}),
      Meeting.deleteMany({}),
      Attendance.deleteMany({}),
      SavingsTransaction.deleteMany({}),
      Loan.deleteMany({}),
      Product.deleteMany({}),
      Announcement.deleteMany({}),
      Group.deleteMany({})
    ]);

    console.log('🧹 Cleaned existing database collections');

    // 1. Create Group
    const group = await Group.create({
      name: 'Sakhi Mahila Bachat Gat (सखी महिला बचत गट)',
      registrationNumber: 'MH/PUN/SHG/2023/0489',
      village: 'Shivaji Nagar (शिवाजी नगर)',
      taluka: 'Haveli (हवेली)',
      district: 'Pune, Maharashtra (पुणे, महाराष्ट्र)',
      leaderName: 'Sunita Patil (अध्यक्ष - सुनिता पाटील)',
      leaderPhone: '9822012345',
      secretaryName: 'Meera Deshmukh (सचिव - मीरा देशमुख)',
      treasurerName: 'Asha Shinde (खजिनदार - आशा शिंदे)',
      monthlyContribution: 500,
      defaultInterestRate: 1.0,
      meetingSchedule: 'Every month on 26th at 4:00 PM (दरमहा २६ तारखेला दुपारी ४:०० वाजता)',
      bankDetails: {
        bankName: 'Bank of Maharashtra (बँक ऑफ महाराष्ट्र)',
        accountNumber: '60129845721',
        ifscCode: 'MAHB0000123',
        branch: 'Shivaji Nagar Branch, Pune'
      }
    });

    // 2. Create 20 Members
    const membersData = [
      { code: 'MBG-001', name: 'Sunita Patil (सुनिता पाटील)', phone: '9822012345', role: 'अध्यक्ष (President)', address: 'Galli No. 1, Shivaji Nagar, Pune' },
      { code: 'MBG-002', name: 'Meera Deshmukh (मीरा देशमुख)', phone: '9822023456', role: 'सचिव (Secretary)', address: 'Near Maruti Mandir, Shivaji Nagar, Pune' },
      { code: 'MBG-003', name: 'Asha Shinde (आशा शिंदे)', phone: '9822034567', role: 'खजिनदार (Treasurer)', address: 'Plot 12, Ganesh Colony, Pune' },
      { code: 'MBG-004', name: 'Pooja Jadhav (पूजा जाधव)', phone: '9845321987', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-005', name: 'Rekha More (रेखा मोरे)', phone: '9845218765', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-006', name: 'Vandana Kulkarni (वंदना कुलकर्णी)', phone: '9876543210', role: 'सदस्य (Member)', address: 'Sadashiv Peth, Pune' },
      { code: 'MBG-007', name: 'Lata Gaikwad (लता गायकवाड)', phone: '9823124578', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-008', name: 'Anita Pawar (अनिता पवार)', phone: '9823567891', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-009', name: 'Surekha Thorat (सुरेखा थोरात)', phone: '9823891234', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-010', name: 'Mangal Kamble (मंगल कांबळे)', phone: '9823456712', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-011', name: 'Shobha Chavan (शोभा चव्हाण)', phone: '9823678910', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-012', name: 'Kavita Bhosale (कविता भोसले)', phone: '9823987654', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-013', name: 'Ranjana Salunkhe (रंजना साळुंखे)', phone: '9823112233', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-014', name: 'Usha Jagtap (उषा जगताप)', phone: '9823445566', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-015', name: 'Suman Mane (सुमन माने)', phone: '9823778899', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-016', name: 'Chhaya Sawant (छाया सावंत)', phone: '9823001122', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-017', name: 'Urmila Kale (उर्मिला काळे)', phone: '9823334455', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-018', name: 'Archana Tambe (अर्चना तांबे)', phone: '9823667788', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-019', name: 'Sangeeta Nikam (संगीता निकम)', phone: '9823990011', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' },
      { code: 'MBG-020', name: 'Kalpana Ghorpade (कल्पना घोरपडे)', phone: '9823223344', role: 'सदस्य (Member)', address: 'Shivaji Nagar, Pune' }
    ];

    const createdMembers = await Member.insertMany(
      membersData.map((m) => ({
        groupId: group._id,
        memberCode: m.code,
        name: m.name,
        phone: m.phone,
        roleInGroup: m.role,
        address: m.address,
        joinDate: new Date('2024-01-15'),
        status: 'active'
      }))
    );
    console.log(`✅ Seeded ${createdMembers.length} members`);

    // 3. Create Users
    // Admin User (Sunita Patil - Group Leader)
    const adminUser = await User.create({
      name: 'Sunita Patil (सुनिता पाटील)',
      email: 'admin@sakhisetu.org',
      password: 'admin123', // Will be hashed by userSchema pre-save hook
      role: 'admin',
      memberId: createdMembers[0]._id,
      groupId: group._id,
      phone: '9822012345',
      preferredLanguage: 'mr',
      active: true
    });

    // Member User (Meera Deshmukh)
    const memberUser = await User.create({
      name: 'Meera Deshmukh (मीरा देशमुख)',
      email: 'meera@sakhisetu.org',
      password: 'member123',
      role: 'member',
      memberId: createdMembers[1]._id,
      groupId: group._id,
      phone: '9822023456',
      preferredLanguage: 'mr',
      active: true
    });
    console.log('✅ Seeded Admin and Member users');

    // 4. Create Meetings
    const pastMeeting1 = await Meeting.create({
      groupId: group._id,
      title: 'मासिक बचत सभा - ऑगस्ट २०२६ (Monthly Meeting - Aug 2026)',
      meetingDate: new Date('2026-08-26T16:00:00.000Z'),
      startTime: '04:00 PM',
      location: 'समाज मंदिर (Community Hall), शिवाजी नगर',
      agenda: ['मासिक बचत गोळा करणे', 'नवीन कर्ज अर्ज मंजुरी', 'उत्पादने विक्री आढावा'],
      notes: 'सर्व सदस्यांनी वेळेवर हजेरी लावली. एकूण ₹१०,००० बचत जमा झाली.',
      status: 'completed',
      createdBy: adminUser._id
    });

    const pastMeeting2 = await Meeting.create({
      groupId: group._id,
      title: 'मासिक बचत सभा - सप्टेंबर २०२६ (Monthly Meeting - Sep 2026)',
      meetingDate: new Date('2026-09-26T16:00:00.000Z'),
      startTime: '04:00 PM',
      location: 'समाज मंदिर (Community Hall), शिवाजी नगर',
      agenda: ['मासिक बचत जमा करणे', 'कर्ज परतफेड जमा करणे', 'दिवाळी स्टॉल नियोजन'],
      notes: 'दिवाळी प्रदर्शनासाठी स्टॉल बुक करण्याचा निर्णय एकमुखाने मंजूर झाला.',
      status: 'completed',
      createdBy: adminUser._id
    });

    const upcomingMeeting = await Meeting.create({
      groupId: group._id,
      title: 'मासिक बचत सभा - ऑक्टोबर २०२६ (Monthly Meeting - Oct 2026)',
      meetingDate: new Date('2026-10-26T16:00:00.000Z'),
      startTime: '04:00 PM',
      location: 'समाज मंदिर (Community Hall), शिवाजी नगर',
      agenda: [
        'मासिक बचत गोळा करणे (Monthly savings collection)',
        'कर्ज वाटप व परतफेड तपासणी (Loan disbursal & repayment check)',
        'दिवाळी प्रदर्शन स्टॉल तयारी (Diwali exhibition stall preparation)'
      ],
      notes: 'कृपया सर्व सदस्यांनी आपली बचत रक्कम व पासबुक सोबत आणावे.',
      status: 'upcoming',
      createdBy: adminUser._id
    });
    console.log('✅ Seeded 3 Meetings');

    // 5. Seed Attendance for Past Meetings
    const attendanceOps = [];
    createdMembers.forEach((member, idx) => {
      // Past meeting 1 (almost all present)
      attendanceOps.push({
        meetingId: pastMeeting1._id,
        memberId: member._id,
        status: idx === 4 || idx === 11 ? 'absent' : 'present',
        note: idx === 4 ? 'आजारी असल्याने अनुपस्थित' : ''
      });
      // Past meeting 2
      attendanceOps.push({
        meetingId: pastMeeting2._id,
        memberId: member._id,
        status: idx === 8 ? 'absent' : 'present',
        note: idx === 8 ? 'गावी गेल्यामुळे रजा' : ''
      });
    });
    await Attendance.insertMany(attendanceOps);
    console.log(`✅ Seeded ${attendanceOps.length} attendance records`);

    // 6. Seed Savings Transactions
    // Total savings matching PDF screenshot (₹25,000 total)
    // 20 members * ₹500 * previous 2 months + current month records = ₹25,000
    const savingsRecords = [];
    // August 2026: 20 members * 500 = 10,000
    createdMembers.forEach((m) => {
      savingsRecords.push({
        groupId: group._id,
        memberId: m._id,
        transactionDate: new Date('2026-08-26'),
        amount: 500,
        paymentMode: 'Cash / रोख',
        monthYear: '2026-08',
        note: 'ऑगस्ट मासिक बचत',
        createdBy: adminUser._id
      });
    });
    // September 2026: 20 members * 500 = 10,000
    createdMembers.forEach((m) => {
      savingsRecords.push({
        groupId: group._id,
        memberId: m._id,
        transactionDate: new Date('2026-09-26'),
        amount: 500,
        paymentMode: 'Cash / रोख',
        monthYear: '2026-09',
        note: 'सप्टेंबर मासिक बचत',
        createdBy: adminUser._id
      });
    });
    // October 2026 early contributions (10 members * 500 = 5,000)
    // Total = 10000 + 10000 + 5000 = ₹25,000 EXACTLY matching the screenshot!
    createdMembers.slice(0, 10).forEach((m) => {
      savingsRecords.push({
        groupId: group._id,
        memberId: m._id,
        transactionDate: new Date('2026-10-15'),
        amount: 500,
        paymentMode: 'UPI / फोनपे/गुगलपे',
        monthYear: '2026-10',
        note: 'ऑक्टोबर आगाऊ बचत',
        createdBy: adminUser._id
      });
    });

    await SavingsTransaction.insertMany(savingsRecords);
    console.log(`✅ Seeded ${savingsRecords.length} savings transactions totaling ₹25,000`);

    // 7. Seed Loans
    // Outstanding loan amount matching PDF screenshot (₹8,000 total)
    // Loan 1: Pooja Jadhav (MBG-004) - Principal ₹10,000 for Tailoring machine, Repaid ₹5,000, Outstanding: ₹5,000
    const loan1 = await Loan.create({
      groupId: group._id,
      memberId: createdMembers[3]._id,
      loanNumber: 'LN-2026-001',
      principalAmount: 10000,
      monthlyInterestRate: 1.0,
      agreedTerms: '1% दरमहा व्याज (1% monthly interest), 6 हप्ते',
      purpose: 'लहान शिलाई मशीन खरेदी (Tailoring sewing machine purchase)',
      loanDate: new Date('2026-07-26'),
      dueDate: new Date('2027-01-26'),
      status: 'active',
      repayments: [
        {
          paymentDate: new Date('2026-08-26'),
          amount: 2500,
          principalPaid: 2500,
          interestPaid: 100,
          paymentMode: 'Cash / रोख',
          note: 'हप्ता क्रमांक १',
          recordedBy: adminUser._id
        },
        {
          paymentDate: new Date('2026-09-26'),
          amount: 2500,
          principalPaid: 2500,
          interestPaid: 75,
          paymentMode: 'Cash / रोख',
          note: 'हप्ता क्रमांक २',
          recordedBy: adminUser._id
        }
      ],
      createdBy: adminUser._id
    });

    // Loan 2: Rekha More (MBG-005) - Principal ₹5,000 for Spices/Pickles Raw material, Repaid ₹2,000, Outstanding: ₹3,000
    // Total Outstanding = 5000 + 3000 = ₹8,000 EXACTLY matching the screenshot!
    const loan2 = await Loan.create({
      groupId: group._id,
      memberId: createdMembers[4]._id,
      loanNumber: 'LN-2026-002',
      principalAmount: 5000,
      monthlyInterestRate: 1.0,
      agreedTerms: '1% दरमहा व्याज (1% monthly interest), 5 हप्ते',
      purpose: 'मसाले व लोणचे कच्चा माल खरेदी (Raw material for pickles & spices)',
      loanDate: new Date('2026-08-26'),
      dueDate: new Date('2027-01-26'),
      status: 'active',
      repayments: [
        {
          paymentDate: new Date('2026-09-26'),
          amount: 2000,
          principalPaid: 2000,
          interestPaid: 50,
          paymentMode: 'UPI / फोनपे/गुगलपे',
          note: 'हप्ता क्रमांक १',
          recordedBy: adminUser._id
        }
      ],
      createdBy: adminUser._id
    });

    console.log('✅ Seeded 2 Loans with total outstanding ₹8,000 matching screenshot');

    // 8. Seed Products (Matching screenshots on PDF page 1)
    const productsData = [
      {
        name: 'घरगुती कैरीचे लोणचे (Homemade Mango Pickle)',
        category: 'Food / खाद्यपदार्थ',
        description: 'पारंपरिक पद्धतीने तयार केलेले, शुद्ध मोहरीचे तेल आणि अस्सल मसाल्यांचे स्वादिष्ट कैरीचे लोणचे. रासायनिक घटक विरहित.',
        price: 150,
        unit: '500g बाटली',
        imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
        makerName: 'सुनिता पाटील (Sunita Patil)',
        memberId: createdMembers[0]._id,
        contactPhone: '9822012345',
        availability: 'available',
        featured: true
      },
      {
        name: 'हातमागाची कापडी पिशवी (Handmade Cotton Bag)',
        category: 'Handicrafts / हस्तकला',
        description: 'पर्यावरणपूरक आणि मजबूत कॉटन फॅब्रिकची आकर्षक कापडी पिशवी. भाजीपाला व दैनंदिन खरेदीसाठी उत्तम.',
        price: 100,
        unit: 'नग (Piece)',
        imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
        makerName: 'पूजा जाधव (Pooja Jadhav)',
        memberId: createdMembers[3]._id,
        contactPhone: '9845321987',
        availability: 'available',
        featured: true
      },
      {
        name: 'हस्तनिर्मित एम्ब्रॉयडरी पर्स (Handmade Embroidered Purse)',
        category: 'Handicrafts / हस्तकला',
        description: 'पारंपरिक हातकाम व सुंदर भरतकामाची आकर्षक महिला पर्स. विवाह व समारंभासाठी उत्तम भेट.',
        price: 300,
        unit: 'नग (Piece)',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        makerName: 'मीरा देशमुख (Meera Deshmukh)',
        memberId: createdMembers[1]._id,
        contactPhone: '9822023456',
        availability: 'available',
        featured: true
      },
      {
        name: 'कोल्हापुरी स्पेशल कांदा लसूण मसाला (Kolhapuri Garam Masala)',
        category: 'Spices / मसाले',
        description: 'अस्सल गावरान चवीचा कांदा लसूण मसाला. घरगुती पद्धतीनुसार भाजून कुटलेला, भाजीला झणझणीत चव देणारा.',
        price: 180,
        unit: '250g पॅक',
        imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
        makerName: 'आशा शिंदे (Asha Shinde)',
        memberId: createdMembers[2]._id,
        contactPhone: '9822034567',
        availability: 'available',
        featured: false
      },
      {
        name: 'नैसर्गिक कडुनिंब व कोरफड साबण (Herbal Neem & Aloe Soap)',
        category: 'Cosmetics / घरगुती साबण व उत्पादने',
        description: 'शुद्ध खोबरेल तेल, कोरफडीचा गर आणि कडुनिंबाच्या पानांचा रस वापरून तयार केलेला नैसर्गिक ग्लिसरीन साबण.',
        price: 60,
        unit: '100g बार',
        imageUrl: 'https://images.unsplash.com/photo-1607006314642-88f5f0858fb3?auto=format&fit=crop&w=600&q=80',
        makerName: 'रेखा मोरे (Rekha More)',
        memberId: createdMembers[4]._id,
        contactPhone: '9845218765',
        availability: 'available',
        featured: false
      },
      {
        name: 'कुरकुरीत पोहा व साबुदाणा पापड (Crunchy Papad Combo)',
        category: 'Food / खाद्यपदार्थ',
        description: 'उन्हाळी कामात तयार केलेले शुद्ध साबुदाणा व बटाटा चकली आणि पोहा पापड कॉम्बो. उपवासासाठी उत्तम.',
        price: 120,
        unit: '400g पॅक',
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        makerName: 'वंदना कुलकर्णी (Vandana Kulkarni)',
        memberId: createdMembers[5]._id,
        contactPhone: '9876543210',
        availability: 'available',
        featured: false
      }
    ];

    await Product.insertMany(productsData.map((p) => ({ ...p, groupId: group._id })));
    console.log(`✅ Seeded ${productsData.length} member products`);

    // 9. Seed Announcements
    const announcementsData = [
      {
        title: 'मासिक सभा सूचना - २६ ऑक्टोबर २०२६ (Monthly Meeting Notice)',
        body: 'सखी महिला बचत गटाची मासिक सभा २६ ऑक्टोबर रोजी दुपारी ४:०० वाजता समाज मंदिर हॉल येथे आयोजित केली आहे. सर्व भगिनींनी उपस्थित राहावे.',
        category: 'Meeting Notice / सभा सूचना',
        priority: 'high',
        status: 'active',
        postedDate: new Date('2026-10-20'),
        createdBy: adminUser._id
      },
      {
        title: 'मासिक बचत योगदान जमा करण्याची शेवटची तारीख (Savings Deadline)',
        body: 'ऑक्टोबर महिन्याचे मासिक बचत योगदान ₹५०० दिनांक २५ ऑक्टोबर २०२६ पर्यंत जमा करावे ही नम्र विनंती.',
        category: 'Financial / आर्थिक सूचना',
        priority: 'high',
        status: 'active',
        postedDate: new Date('2026-10-18'),
        createdBy: adminUser._id
      },
      {
        title: 'जिल्हास्तरीय महिला बचत गट प्रदर्शन व विक्री (District SHG Exhibition)',
        body: 'पुढील महिन्यात शिवाजीनगर मैदान येथे जिल्हास्तरीय महिला उद्योजक प्रदर्शन होणार आहे. ज्या सदस्यांना आपली उत्पादने मांडायची आहेत त्यांनी त्वरित नावे नोंदवावीत.',
        category: 'Exhibition / प्रदर्शन व विक्री',
        priority: 'normal',
        status: 'active',
        postedDate: new Date('2026-10-15'),
        createdBy: adminUser._id
      }
    ];

    await Announcement.insertMany(announcementsData.map((a) => ({ ...a, groupId: group._id })));
    console.log(`✅ Seeded ${announcementsData.length} group announcements`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
