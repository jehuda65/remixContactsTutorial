import {
  Form,
  NavLink,
  Links,
  Outlet,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

import { useEffect } from "react";

import { createEmptyContact, getContacts } from "./data";

import { LinksFunction, json, redirect, LoaderFunctionArgs } from "@remix-run/node";

import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching = 
  navigation.location &&
  new URLSearchParams(navigation.location.search).has(
    "q"
  );

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="height-[100%] m-0 leading-6 text-[#121212]">
       
        <div id="sidebar" className="bg-[#f7f7f7] border-r border-[#e3e3e3] w-96 flex flex-col place-content-between h-[100vh] pt-4" >
          <h1 className="order-last font-bold border-t py-5 pl-10">Remix Contacts</h1>
          <div className="flex space-x-3 border-b pb-4 pl-10">
            <Form id="search-form"
            onChange={(event) => {
              const isFirstSearch = q === null;
              submit(event.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
             role="search">
              <div className="flex rounded-lg px-2 py-2 shadow shadow-gray-300 bg-white leading-6 m-0">
      
              <input
              defaultValue={q || ""}
                id="q"
                aria-label="Search contacts"
                className={searching ? "loading" : ""}
                placeholder="Search"
                type="search"
                name="q"
              />
              </div>
              
              <div id="search-spinner" aria-hidden hidden={!searching} />
             
            </Form>
            <Form method="post">
              <button type="submit"
              className="rounded-lg shadow shadow-gray-300 px-3 py-2 shadow-[0 0px 1px hsla(0, 0%, 0%, 0.2), 0 1px 2px hsla(0, 0%, 0%, 0.2)] bg-white leading-6 m-0 text-[#3992ff] font-semibold active:shadow-[0 0px 1px hsla(0, 0%, 0%, 0.4)] active:translate-y-[1px]">New</button>
            </Form>
          </div>
          <nav className="px-8 basis-3/4">
            {contacts.length ? (
            <ul className="leading-10 ">
            {contacts.map((contact) => (
                  <li className="rounded-md pl-2 hover:bg-blue-500 hover:text-white" key={contact.id}>
                    <NavLink className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                  to={`contacts/${contact.id}`}>
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </NavLink>
                  </li>
                ))}
            </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div className={navigation.state === "loading" && !searching
        ? "loading"
        : ""
        }   id="detail">
          <div className="left-96 absolute top-10 ml-16 flex">
          <Outlet  />
          </div>
        </div>
        
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      
      </body>
    </html>
  );
}
