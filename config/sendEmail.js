import sendEmail from "../utils/emailService.js";

const sendEmailFun = async (to , subject , text , html) => {
    console.log(to);
    
 const result = await sendEmail(to, subject , text , html)
 if (result.success) {
    console.log("Email sent successfully");
    return true;
 } else {
    console.error("Error sending email:", result.error);
    return false;
 }
}

export default sendEmailFun;