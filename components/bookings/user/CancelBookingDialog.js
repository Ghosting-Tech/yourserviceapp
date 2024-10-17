import React, { useState } from "react";
import {
  Dialog,
  Select,
  Option,
  Textarea,
  Button,
} from "@material-tailwind/react"; // Assuming you're using Material-UI
import { toast } from "sonner";
import axios from "axios";

const CancelBookingDialog = ({
  booking,
  cancellationReasonDialog,
  handleCancellationReasonDialog,
}) => {
  const [cancellationReasonNotListed, setCancellationReasonNotListed] =
    useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const handleCancelBooking = async () => {
    try {
      if (cancellationReason === "") {
        toast.error("Give a cancellation reason!");
        return;
      }
      const response = await axios.put(`/api/bookings/${booking._id}`, {
        ...booking,
        status: "Cancelled",
        canceledByCustomer: cancellationReason,
      });
      if (response.status === 201) {
        handleCancellationReasonDialog();
        setCancellationReason("");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      open={cancellationReasonDialog}
      onClose={handleCancellationReasonDialog}
      className="p-6"
    >
      <div className="text-red-500 text-xl font-medium">
        Are you sure you want to cancel this booking?
      </div>
      <div className="flex flex-col gap-4 mb-2">
        <div className="text-xs">
          Please provide a cancellation reason so that we can provide a refund
          or compensation.
        </div>

        <Select
          label="Choose a reason"
          onChange={(e) => {
            if (e === "not here") {
              setCancellationReasonNotListed(true);
              setCancellationReason("");
            } else {
              setCancellationReasonNotListed(false);
              setCancellationReason(e);
            }
          }}
          value={cancellationReason}
        >
          <Option value="Change of Plans: My schedule has changed, and I no longer need the service.">
            Change of Plans: My schedule has changed, and I no longer need the
            service.
          </Option>
          <Option value="I found another provider that better fits my needs.">
            I found another provider that better fits my needs.
          </Option>
          <Option value="The service cost is higher than I expected or can't afford.">
            The service cost is higher than I expected or can not afford.
          </Option>
          <Option value="I have a personal emergency that prevents me from proceeding.">
            I have a personal emergency that prevents me from proceeding.
          </Option>
          <Option value="I no longer require the service I booked.">
            I no longer require the service I booked.
          </Option>
          <Option value="I made a mistake when booking the service.">
            I made a mistake when booking the service.
          </Option>
          <Option value="The service provider is unavailable at the desired time.">
            The service provider is unavailable at the desired time.
          </Option>
          <Option value="not here">Not here?</Option>
        </Select>

        {cancellationReasonNotListed && (
          <Textarea
            autoFocus
            id="cancellationReason"
            label="Cancellation Reason (Optional)"
            fullWidth
            variant="filled"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
          />
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={handleCancellationReasonDialog}
          variant="gradient"
          color="teal"
        >
          Go back to bookings
        </Button>
        <Button onClick={handleCancelBooking} variant="gradient" color="red">
          Cancel Booking
        </Button>
      </div>
    </Dialog>
  );
};

export default CancelBookingDialog;
