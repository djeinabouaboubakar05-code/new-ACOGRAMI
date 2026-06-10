import { Resend } from "resend";

// Initialize Resend with API Key from environment
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

// Determine sender address (Resend requires a verified domain or uses onboarding@resend.dev for testing)
const senderEmail = process.env.EMAIL_SENDER || "Acogrami <onboarding@resend.dev>";

export async function sendAdhesionAccepted(email: string, mdp: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Mock Email (No API Key) - Accepted:", email, mdp);
    return;
  }
  
  try {
    await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: "Votre demande d'adhésion à Acogrami a été validée",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #1b4d3e;">Bienvenue dans Acogrami</h1>
          <p>Votre demande d'adhésion a été validée avec succès.</p>
          <p>Voici vos identifiants pour vous connecter à votre espace membre :</p>
          <ul style="background: #f5f5f4; padding: 15px; border-radius: 5px; list-style-type: none;">
            <li><strong>Email :</strong> ${email}</li>
            <li><strong>Mot de passe :</strong> ${mdp}</li>
          </ul>
          <p>Nous vous recommandons de modifier ce mot de passe dès votre première connexion en vous rendant dans votre profil.</p>
          <br>
          <p>Cordialement,<br><strong>L'équipe Acogrami</strong></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Erreur d'envoi d'email (Acceptation):", error);
  }
}

export async function sendAdhesionRejected(email: string, motif: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Mock Email (No API Key) - Rejected:", email, motif);
    return;
  }

  try {
    await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: "Mise à jour concernant votre demande d'adhésion",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #cc7722;">Information concernant votre demande</h1>
          <p>Nous vous remercions pour l'intérêt que vous portez à Acogrami.</p>
          <p>Malheureusement, votre demande d'adhésion a été rejetée pour le motif suivant :</p>
          <blockquote style="border-left: 4px solid #cc7722; padding: 10px 15px; margin-left: 0; background: #fdfbf7; color: #555;">
            ${motif}
          </blockquote>
          <p>Si vous souhaitez plus d'informations, n'hésitez pas à nous contacter.</p>
          <br>
          <p>Cordialement,<br><strong>L'équipe Acogrami</strong></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Erreur d'envoi d'email (Rejet):", error);
  }
}

export async function sendNewsletterNotification(emails: string[], subject: string, content: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Mock Email (No API Key) - Newsletter:", subject, "to", emails.length, "subscribers");
    return;
  }

  try {
    // Note: Resend allows up to 50 recipients per API call in the 'BCC' or 'TO' field.
    // For larger lists, batches would be necessary.
    await resend.emails.send({
      from: senderEmail,
      bcc: emails, // Use BCC so subscribers don't see each other's emails
      to: senderEmail, // Primary to must be defined
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          ${content}
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin-top: 40px;" />
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            Vous recevez cet email car vous êtes abonné(e) à la newsletter d'Acogrami.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la newsletter:", error);
  }
}
