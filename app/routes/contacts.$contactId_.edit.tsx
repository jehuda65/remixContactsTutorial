import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, updateContact } from "../data";

export const action = async({
    params, request,
}: ActionFunctionArgs) => {
    invariant(params.contactId, "Missing contactId param");
    const FormData = await request.formData();
    const updates = Object.fromEntries(FormData);
    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`);
};


export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form id="contact-form" className="flex flex-col space-y-4" method="post">
      <p className="flex">
        <span className="basis-1/5">Name</span>
        
        <input
          className="ml-16 mr-3 basis-2/5  border border-opacity-50 shadow px-2 rounded-md py-1"
          defaultValue={contact.first}
          aria-label="First name"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          className=" basis-2/5 border border-opacity-50 shadow px-2 rounded-md py-1"
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label className="flex">
        <span className="basis-1/5">Twitter</span>
        <input
          className="ml-0 basis-4/5 border border-opacity-50 shadow px-2 rounded-md py-1"
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label className=" flex">
        <span className="basis-1/5">Avatar URL</span>
        <input
        className="basis-4/5 py-1 border border-opacity-50 shadow px-3 rounded-md"
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label className=" flex">
        <span className="basis-1/5">Notes</span>
        <textarea
        className="flex-grow-2 basis-4/5 border border-opacity-50 shadow rounded-md py-1"
          defaultValue={contact.notes}
          name="notes"
          rows={6}
        />
      </label>
      <p className="flex  pl-0">
        <div className="basis-1/5"></div>
        <button type="submit" 
                className="hover:bg-slate-50 rounded-lg shadow shadow-gray-300 px-3 py-1.5 shadow-[0 0px 1px hsla(0, 0%, 0%, 0.2), 0 1px 2px hsla(0, 0%, 0%, 0.2)] bg-white leading-6 m-0 text-[#3992ff] font-semibold active:shadow-[0 0px 1px hsla(0, 0%, 0%, 0.4)] active:translate-y-[1px]"
        >Save
        </button>
        <button onClick={() => navigate(-1)}
                type="button"
                className="hover:bg-slate-50 ml-2 rounded-lg shadow shadow-gray-300 px-3 py-1.5 shadow-[0 0px 1px hsla(0, 0%, 0%, 0.2), 0 1px 2px hsla(0, 0%, 0%, 0.2)] bg-white leading-6 m-0 font-semibold active:shadow-[0 0px 1px hsla(0, 0%, 0%, 0.4)] active:translate-y-[1px]"
         >Cancel
        </button>
      </p>
    </Form>
  );
}
