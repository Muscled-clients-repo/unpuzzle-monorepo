import UserActivityInterface from "../interface/user-activity.js";
import { fetchApi } from "../utils/api.js";

class UserActivity {
    constructor() {
        this.endpoint = `/api/activity-logs`; 
        this.userActivityInterface = new UserActivityInterface();
    }

    getActivityLogs=async()=> {
        try {
            const response = await fetchApi(`${this.endpoint}?videoId=${window.ytPlayer.video.id}`);
            const {body} = await response.json();
            console.log("User activity", body)
            this.userActivityInterface.update(body);
            return body;
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            return [];
        }
    }

    init() {
        this.getActivityLogs();
    }
}

export default UserActivity;