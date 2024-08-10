import { Button } from "@/components/ui/Button";
import { getUser } from "@/libs/jwt-decode";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { BsCopy } from "react-icons/bs";
import { getEventHandler } from "../api/getEvents";
import {
  CredentialResponse,
  getInstalledAppsHandler,
} from "../api/getInstalledAppHandler";
import { CreateEventDialog } from "../components";
import { CreateEventForm } from "../components/CreateEventForm";
import { EventProps } from "../types";

export type CredentialResponseType = CredentialResponse & { name: string };

export const CreateEvent = () => {
  const [events, setEvents] = useState<EventProps[]>();
  const [installedApps, setInstappedApps] = useState<CredentialResponseType[]>(
    []
  );

  const [reload, setReload] = useState(false);

  const user = getUser();

  const [openCreateEventDialog, setOpenCreateEventDialog] = useState(false);
  useEffect(() => {
    const getEvents = async () => {
      const response = await getEventHandler();
      setEvents(response);
    };

    getEvents();
  }, [reload]);

  useEffect(() => {
    const getInstalledApps = async () => {
      const response = await getInstalledAppsHandler();
      console.log("response", response);

      const result = response.map((item) => {
        return {
          ...item,
          name: item.slug.replace("_", " "),
        };
      });
      setInstappedApps(result);
    };

    getInstalledApps();
  }, []);

  console.log("Insssss", installedApps);

  return (
    <section className="">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-2xl font-medium">User Events</h2>
        </div>

        <Button
          variant="primary"
          className="bg-[#001529] text-white"
          onClick={() => setOpenCreateEventDialog(true)}
        >
          Create event
        </Button>
      </div>

      <section>
        {events?.map((item, index) => (
          <div
            key={index}
            className="border py-2 px-3 mb-2 rounded-md flex justify-between items-center"
          >
            <div>
              <div>
                {item.title}-{item.duration}
                mins
              </div>
              <div>{item.description}</div>
            </div>

            <CopyToClipboard
              text={`${import.meta.env.VITE_APPLICATION_URL}/bookme/${
                user?.sub
              }/${item.slug}`}
              onCopy={() => toast.success("Invitation link copied")}
            >
              <Button
                size="small"
                prefixIcon={<BsCopy />}
                type="button"
                // onClick={() => handleCopyInvite(item)}
              />
            </CopyToClipboard>
          </div>
        ))}
      </section>

      <CreateEventDialog
        open={openCreateEventDialog}
        onClose={() => setOpenCreateEventDialog(false)}
      >
        <CreateEventForm
          onClose={() => setOpenCreateEventDialog(false)}
          reload={() => setReload((prev) => !prev)}
          locations={installedApps}
        />
      </CreateEventDialog>
    </section>
  );
};
