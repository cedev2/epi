const CalendarEvent = require('../models/CalendarEvent');

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, type } = req.body;
        const event = await CalendarEvent.create({
            title,
            description,
            date,
            type,
            createdBy: req.user.id
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await CalendarEvent.findAll({
            order: [['date', 'ASC']]
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await CalendarEvent.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        await event.destroy();
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
