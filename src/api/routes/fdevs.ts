import { Router } from 'express';

const router = Router();

router
    .get('/memberCount', (req, res) => {
        if (!req.client) res.status(400).json({ error: 'Unauthorized' });
        res.status(200).json({
            memberCount:
                req.client.guilds.cache.get('731520035717251142').memberCount,
        });
    })
    .get('/devHelperCount', (req, res) => {
        if (!req.client) res.status(400).json({ error: 'Unauthorized' });
        res.status(200).json({
            devHelperCount: req.client.guilds.cache
                .get('731520035717251142')
                .roles.cache.get('731523484794093678').members.size,
        });
    })
    .get('/staffCount', (req, res) => {
        if (!req.client) res.status(400).json({ error: 'Unauthorized' });
        res.status(200).json({
            staffCount: req.client.guilds.cache
                .get('731520035717251142')
                .roles.cache.get('858269153269514250').members.size,
        });
    })
    .get('/staffMembers', (req, res) => {
        if (!req.client) res.status(400).json({ error: 'Unauthorized' });
        const staffMembers = [];
        req.client.guilds.cache
            .get('731520035717251142')
            .roles.cache.get('858269153269514250')
            .members.forEach((member) => {
                let staffObject = {};
                staffObject['color'] = member.displayHexColor;
                staffObject['position'] = member.roles.cache.has(
                    '828764198996934687'
                )
                    ? 'Server Owner'
                    : member.roles.cache.has('731523466020520019')
                    ? 'Adminstrator'
                    : member.roles.cache.has('731523470109966446')
                    ? 'Moderator'
                    : member.roles.cache.has('746259885464748052')
                    ? 'Helper'
                    : 'Staff';
                staffObject['positionNumber'] = member.roles.cache.has(
                    '828764198996934687'
                )
                    ? '4'
                    : member.roles.cache.has('731523466020520019')
                    ? '3'
                    : member.roles.cache.has('731523470109966446')
                    ? '2'
                    : member.roles.cache.has('746259885464748052')
                    ? '1'
                    : '0';
                staffObject['username'] = member.user.username;
                staffObject['avatar'] = member.user.avatarURL({
                    dynamic: true,
                });
                staffMembers.push(staffObject);
            });
        staffMembers.sort((staff1, staff2) => {
            return staff2.positionNumber - staff1.positionNumber;
        });
        res.status(200).json({ staffMembers: staffMembers });
    });

export default router;
