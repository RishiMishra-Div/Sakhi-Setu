import { Group } from '../models/Group.js';

export const getGroup = async (req, res) => {
  try {
    let group = await Group.findOne();
    if (!group) {
      group = await Group.create({
        name: 'Sakhi Mahila Bachat Gat (सखी महिला बचत गट)',
        registrationNumber: 'MH/PUN/SHG/2023/0489',
        village: 'Shivaji Nagar / शिवाजी नगर',
        taluka: 'Haveli / हवेली',
        district: 'Pune, Maharashtra / पुणे, महाराष्ट्र'
      });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch group info', error: error.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    let group = await Group.findOne();
    if (!group) {
      group = new Group(req.body);
    } else {
      Object.assign(group, req.body);
    }
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update group info', error: error.message });
  }
};
