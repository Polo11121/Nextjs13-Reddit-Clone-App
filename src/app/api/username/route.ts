import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { z } from "zod";

export const PATCH = async (req: Request) => {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const body = await req.json();

    const { username } = UsernameValidator.parse(body);

    const isUsed = await db.user.findFirst({
      where: {
        username,
      },
    });

    if (isUsed) {
      return new Response("Username is taken", {
        status: 409,
      });
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username,
      },
    });

    return new Response("OK", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not update username, please try again later.", {
      status: 500,
    });
  }
};
