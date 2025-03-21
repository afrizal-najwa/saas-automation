import { AccordionContent } from "@/components/ui/accordion";
import { ConnectionProviderProps } from "@/providers/connections-provider";
import { EditorState } from "@/providers/editor-provider";
import { nodeMapper } from "@/lib/types";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { onContentChange } from "@/lib/editor-utils";
import GoogleFileDetails from "./google-file-details";
import GoogleDriveFiles from "./google-drive-files";
import ActionButton from "./action-button";
import axios from "axios";
import { toast } from "sonner";

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: string | boolean | undefined;
}

interface GroupOption {
  [key: string]: Option[];
}

type Props = {
  nodeConnection: ConnectionProviderProps;
  newState: EditorState;
  file: any;
  setFile: (file: any) => void;
  selectedSlackChannels: Option[];
  setSelectedSlackChannels: (value: Option[]) => void;
};

const ContentBasedOnTitle = ({
  nodeConnection,
  newState,
  file,
  setFile,
  selectedSlackChannels,
  setSelectedSlackChannels,
}: Props) => {
  const selectedNode = newState?.editor?.selectedNode;
  if (!selectedNode) return <p>No selected node</p>;

  const title = selectedNode.data.title;
  const mappedKey = nodeMapper[title];
  const nodeConnectionType: any = mappedKey
    ? nodeConnection[mappedKey]
    : undefined;

  useEffect(() => {
    const reqGoogle = async () => {
      try {
        const response = await axios.get("/api/drive");
        if (response.data?.message?.files?.length > 0) {
          console.log(response.data.message.files[0]);
          toast.message("Fetched File");
          setFile(response.data.message.files[0]);
        } else {
          toast.error("No files found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while fetching Google Drive files");
      }
    };
    reqGoogle();
  }, []);

  if (!nodeConnectionType) return <p>Not connected</p>;

  const accessTokenKey =
    {
      Slack: "slackAccessToken",
      Discord: "webhookURL",
      Notion: "accessToken",
    }[title] || null;

  const isConnected =
    title === "Google Drive"
      ? !nodeConnection.isLoading
      : accessTokenKey && !!nodeConnectionType[accessTokenKey];

  if (!isConnected) return <p>Not connected</p>;

  return (
    <AccordionContent>
      <Card>
        {title === "Discord" && (
          <CardHeader>
            <CardTitle>{nodeConnectionType.webhookName}</CardTitle>
            <CardDescription>{nodeConnectionType.guildName}</CardDescription>
          </CardHeader>
        )}
        <div className="flex flex-col gap-3 px-6 py-3 pb-20">
          <p>{title === "Notion" ? "Values to be stored" : "Message"}</p>

          <Input
            type="text"
            value={nodeConnectionType.content || ""}
            onChange={(event) => onContentChange(nodeConnection, title, event)}
          />

          {JSON.stringify(file) !== "{}" && title !== "Google Drive" && (
            <Card className="w-full">
              <CardContent className="px-2 py-3">
                <div className="flex flex-col gap-4">
                  <CardDescription>Drive File</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    <GoogleFileDetails
                      nodeConnection={nodeConnection}
                      title={title}
                      gFile={file}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {title === "Google Drive" && <GoogleDriveFiles />}
          <ActionButton
            currentService={title}
            nodeConnection={nodeConnection}
            channels={selectedSlackChannels}
            setChannels={setSelectedSlackChannels}
          />
        </div>
      </Card>
    </AccordionContent>
  );
};

export default ContentBasedOnTitle;
