import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";
import { json, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node"; 


import invariant from "tiny-invariant";
import { getContact, updateContact, ContactRecord } from "../data";

export const loader = async ({params,
} : LoaderFunctionArgs) => {
    invariant(params.contactId, "Missing contactId param");
    const contact = await getContact(params.contactId);
    if (!contact) {
        throw new Response("Not Found", { status: 404});
    }
    return json({contact});
};

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};


export default function Contact() {
  const {contact} = useLoaderData<typeof loader>();

  
  return (
    <div id="contact" className="flex space-x-10">
      <div className="rounded flex flex-col">
        <img className="rounded-3xl h-36"
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div className="pt-2">
        <div className="flex">
        <h1 className="flex text-2xl font-bold">
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          
        </h1>
        <div className="text-amber-400 text-2xl ml-3"><Favorite contact={contact}  /></div></div>

        {contact.twitter ? (
          <p className="text-blue-500 text-xl">
            <a
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p className="text-sm pt-5 pb-3 ">{contact.notes}</p> : null}

        <div className="flex mt-5">
          <Form action="edit">
            <button className="shadow shadow-gray-300 px-2 py-1.5 rounded-lg text-blue-500" type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button className="shadow shadow-gray-300 px-2 py-1.5 rounded-lg text-red-700" type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
  ? fetcher.formData.get("favorite") === "true"
  : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};
