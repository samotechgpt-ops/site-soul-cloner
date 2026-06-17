import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { isAdmin } = await import("@/lib/admin-auth.server");
        if (!(await isAdmin())) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
        }
        const form = await request.formData();
        const files = form.getAll("files").filter((f): f is File => f instanceof File);
        if (files.length === 0) {
          return new Response(JSON.stringify({ error: "No files provided" }), { status: 400, headers: { "content-type": "application/json" } });
        }
        if (files.length > 6) {
          return new Response(JSON.stringify({ error: "Max 6 files" }), { status: 400, headers: { "content-type": "application/json" } });
        }
        const { uploadProductImage, signImageArray } = await import("@/lib/storage.server");
        try {
          const paths: string[] = [];
          for (const f of files) paths.push(await uploadProductImage(f));
          const urls = await signImageArray(paths);
          return Response.json({ paths, urls });
        } catch (e) {
          return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Upload failed" }), { status: 400, headers: { "content-type": "application/json" } });
        }
      },
    },
  },
});
