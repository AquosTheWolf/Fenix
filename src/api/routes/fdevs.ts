import { Router } from 'express';
const router = Router()

router.get('/memberCount', (req, res) => {
    if(!req.client) res.status(400).json({ error: 'Unauthorized' })
    res.status(200).json({ memberCount: req.client.guilds.cache.get('731520035717251142').memberCount });
}).get('/devHelperCount', (req, res) => {
    if(!req.client) res.status(400).json({ error: 'Unauthorized' })
    res.status(200).json({ devHelperCount: req.client.guilds.cache.get('731520035717251142').roles.cache.get('731523484794093678').members.size });
}).get('/staffCount', (req, res) => {
    if(!req.client) res.status(400).json({ error: 'Unauthorized' })
    res.status(200).json({ staffCount: req.client.guilds.cache.get('731520035717251142').roles.cache.get('858269153269514250').members.size });
}).get('/staffMembers', (req, res) => {
    if(!req.client) res.status(400).json({ error: 'Unauthorized' })
    res.status(200).json({ staffMembers: req.client.guilds.cache.get('731520035717251142').roles.cache.get('858269153269514250').members.toJSON() });
})

export default router;