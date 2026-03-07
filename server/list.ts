
import axios from 'axios';
const key = "AIzaSyBpleKfeCm6BEPMKfuQl4gJDJdcIOBAr9w";
async function list() {
    try {
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        (response.data as any).models.forEach((m: any) => console.log(m.name));
    } catch (e: any) {
        console.error(e.response?.data || e.message);
    }
}
list();
