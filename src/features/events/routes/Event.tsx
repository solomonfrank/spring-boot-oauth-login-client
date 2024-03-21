import { Button } from "@/components/ui/Button";
import { getUser } from "@/libs/jwt-decode";
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast from "react-hot-toast";
import { BsCopy } from "react-icons/bs";
import { getEventHandler } from "../api/getEvents";
import { CreateEventDialog } from "../components";
import { CreateEventForm } from "../components/CreateEventForm";
import { EventProps } from "../types";

export const CreateEvent = () => {
  const [events, setEvents] = useState<EventProps[]>();

  const [reload, setReload] = useState(false);

  const user = getUser();

  console.log("User", user);

  const [openCreateEventDialog, setOpenCreateEventDialog] = useState(false);
  useEffect(() => {
    const getEvents = async () => {
      const response = await getEventHandler();
      console.log("response", response);
      setEvents(response);
    };

    getEvents();
  }, [reload]);

  const handleCopyInvite = (item: EventProps) => {
    console.log("iteeme", item);
  };
  return (
    <section className="">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-3xl font-medium">User Events</h2>
          <h5 className="text-md font-medium">List of created event</h5>
        </div>

        <Button
          variant="secondary"
          className="bg-[red]"
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
              text={`${import.meta.env.VITE_APPLICATION_URL}/${user?.sub}/${
                item.slug
              }`}
              onCopy={() => toast.success("Invitation link copied")}
            >
              <Button
                size="small"
                prefixIcon={<BsCopy />}
                type="button"
                onClick={() => handleCopyInvite(item)}
              >
                Copy invite
              </Button>
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
        />
      </CreateEventDialog>
    </section>
  );
};
