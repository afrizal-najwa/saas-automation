// src/app/(main)/(pages)/connections/_actions/notion-connection.tsx

"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { Client } from "@notionhq/client";

// export const onNotionConnect = async (
//   access_token: string,
//   workspace_id: string,
//   workspace_icon: string,
//   workspace_name: string,
//   database_id: string,
//   id: string
// ) => {
//   'use server'
//   if (access_token) {
//     //check if notion is connected
//     const notion_connected = await db.notion.findFirst({
//       where: {
//         accessToken: access_token,
//       },
//       include: {
//         connections: {
//           select: {
//             type: true,
//           },
//         },
//       },
//     })

//     if (!notion_connected) {
//       //create connection
//       await db.notion.create({
//         data: {
//           userId: id,
//           workspaceIcon: workspace_icon!,
//           accessToken: access_token,
//           workspaceId: workspace_id!,
//           workspaceName: workspace_name!,
//           databaseId: database_id,
//           connections: {
//             create: {
//               userId: id,
//               type: 'Notion',
//             },
//           },
//         },
//       })
//     }
//   }
// }

export const onNotionConnect = async (
  access_token: string,
  workspace_id: string,
  workspace_icon: string,
  workspace_name: string,
  database_id: string,
  id: string
) => {
  "use server";
  if (access_token) {
    const existingConnection = await db.notion.findFirst({
      where: { databaseId: database_id },
      // where: { accessToken: access_token },
    });

    if (existingConnection) {
      // Update existing record
      // await db.notion.update({
      //   where: { databaseId: database_id },
      //   data: {
      //     accessToken: access_token,
      //     workspaceIcon: workspace_icon,
      //     workspaceName: workspace_name,
      //   },
      // });
      console.log("Notion connection already exists with this accessToken.");
      return existingConnection; // Avoid inserting duplicate entry
    } else {
      // Create new entry if it doesn't exist
      await db.notion.create({
        data: {
          userId: id,
          workspaceIcon: workspace_icon!,
          accessToken: access_token,
          workspaceId: workspace_id!,
          workspaceName: workspace_name!,
          databaseId: database_id,
          connections: {
            create: { userId: id, type: "Notion" },
          },
        },
      });
      console.log(
        "Notion connection created successfully.",
        "with",
        database_id
      );
    }
  }
};

// export const getNotionConnection = async () => {
//   const user = await currentUser()
//   if (user) {
//     const connection = await db.notion.findFirst({
//       where: {
//         userId: user.id,
//       },
//     })
//     console.log('User:', user.id);
//     console.log('Fetched Notion Connection:', connection);

//     if (connection) {
//       return connection
//     }
//   }
// }

export const getNotionConnection = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("No user found.");
    return null;
  }

  console.log("Fetching Notion connection for user:", user.id);

  const connection = await db.notion.findFirst({
    where: { userId: user.id },
  });

  console.log("Fetched Notion Connection:", connection);

  return connection;
};

export const getNotionDatabase = async (
  databaseId: string,
  accessToken: string
) => {
  const notion = new Client({
    auth: accessToken,
  });
  const response = await notion.databases.retrieve({ database_id: databaseId });
  return response;
};

// export const onCreateNewPageInDatabase = async (
//   databaseId: string,
//   accessToken: string,
//   content: string
// ) => {
//   const notion = new Client({
//     auth: accessToken,
//   })

//   console.log(databaseId)
//   const response = await notion.pages.create({
//     parent: {
//       type: 'database_id',
//       database_id: databaseId,
//     },
//     properties: {
//       name: [
//         {
//           text: {
//             content: content,
//           },
//         },
//       ],
//     },
//   })
//   if (response) {
//     return response
//   }
// }

export const onCreateNewPageInDatabase = async (
  databaseId: string,
  accessToken: string,
  content: string
) => {
  console.log("Database ID:", databaseId);
  console.log("Access Token:", accessToken);

  if (!databaseId || databaseId.trim() === "") {
    throw new Error("Invalid database ID: " + databaseId);
  }

  if (!accessToken || accessToken.trim() === "") {
    throw new Error("Invalid access token: " + accessToken);
  }

  const notion = new Client({
    auth: accessToken,
  });

  console.log("Creating Notion page in database:", databaseId);

  const response = await notion.pages.create({
    parent: {
      type: "database_id",
      database_id: databaseId,
    },
    properties: {
      title: [
        {
          text: {
            content:
              typeof content === "string" ? content : JSON.stringify(content),
          },
        },
      ],
    },
  });

  if (response) {
    console.log("Page created successfully:", response);
    return response;
  }
};
