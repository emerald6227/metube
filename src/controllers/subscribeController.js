import Subscribe from "../models/Subscribe";

export const createSubscribe = async (req, res) => {
    const {
        params: { id },
        session: { user }
    } = req;

    const subscribeList = await Subscribe.find({ subscribeTo: id, subscribeFrom: user._id });

    if (subscribeList.length !== 0) {
        return res.sendStatus(404);
    }

    const subscribe = await Subscribe.create({
        subscribeTo: id,
        subscribeFrom: user._id
    });
    subscribe.save();
    
    return res.sendStatus(201);
};

export const deleteSubscribe = async (req, res) => {
    const {
        params: { id },
        session: { user }
    } = req;

    const subscribe = await Subscribe.findOneAndDelete({ subscribeTo: id, subscribeFrom: user._id });
    
    if (subscribe === null) {
        return res.sendStatus(404);
    } else {
        return res.sendStatus(200);
    }
};

export const checkSubscribed = async (subscribeTo, subscribeFrom) => {
    const isSubscribed = await Subscribe.findOne({ subscribeTo, subscribeFrom });
    
    if (isSubscribed) {
        return true;
    } else {
        return false;
    }
};

export const getSubscribedCount = async (subscribeTo) => {
    const subscribedCount = await Subscribe.find({ subscribeTo });
    return subscribedCount.length;
};

export const getSubscribedList = async (req, res) => {
    const { user } = req.session;
    const subscribedList = await Subscribe.find({ subscribeFrom: user._id }).sort({createdAt: 'desc'}).populate("subscribeTo");
    const isHeroku = process.env.NODE_ENV === "production";

    if (subscribedList.length === null) {
        return res.sendStatus(404);
    }

    let subscribeInfoList = [];
    for (const subscribed of subscribedList) {
        const subscribeInfo = {
            id: subscribed.subscribeTo._id,
            name: subscribed.subscribeTo.name,
            avatarUrl: subscribed.subscribeTo.avatarUrl
        }
        subscribeInfoList.push(subscribeInfo);
    }

    return res.status(200).json({ subscribeInfoList, isHeroku });
}