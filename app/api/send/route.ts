import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: "gustmb2005@gmail.com",
      subject: `Nova mensagem de ${name}`,
      html: `
        <div>
          <h2>Nova mensagem do portfolio</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erro ao enviar" }, { status: 500 });
  }
}