import { Dialog, IconButton, Button } from "@material-tailwind/react";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { toast } from "sonner";

const UserInvoiceDialog = ({
  booking,
  invoiceDialogOpen,
  handleInvoiceDialog,
  setBooking,
  redirectingLoading,
  handleInvoicePayment,
}) => {
  const handleRejectInvoice = async () => {
    const postData = {
      ...booking,
      invoices: { ...booking.invoices, status: "Invoice Rejected" },
    };
    try {
      const res = await axios.put(`/api/bookings/${booking._id}`, postData);
      if (res.status === 201) {
        toast.success("Invoice rejected successfully!");
        handleInvoiceDialog();
      }
      setBooking(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to reject the invoice!");
    }
  };
  const handleAcceptInvoice = async () => {
    const postData = {
      ...booking,
      status: "Service Invoice Accepted, service will start soon !",
      invoices: {
        ...booking.invoices,
        status: "Invoice Accepted",
      },
    };
    try {
      const res = await axios.put(`/api/bookings/${booking._id}`, postData);
      if (res.status === 201) {
        toast.success("Invoice accepted successfully!");
      }
      setBooking(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to accept the invoice!");
    }
  };
  return (
    <Dialog
      open={invoiceDialogOpen}
      handler={handleInvoiceDialog}
      size="md"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.1, y: 500 },
      }}
      className="p-6"
    >
      <header className="flex items-center justify-between gap-2 mb-2">
        <h1 className="text-center text-xl lg:text-2xl text-gray-700">
          Invoice Detail
        </h1>
        <IconButton variant="text" onClick={handleInvoiceDialog}>
          <RxCross2 size={25} />
        </IconButton>
      </header>
      <div className="bg-white rounded-lg max-h-96 overflow-auto">
        <div className="flex justify-between items-start flex-col lg:flex-row mb-2 gap-2">
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              Title:
              <div className="text-gray-700 font-medium">
                {booking?.invoices?.title}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              Date & Time:
              <div className="text-gray-700 font-medium">
                {booking?.invoices?.date}, {booking?.invoices?.time}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              Total:
              <div className="text-gray-700 font-medium">
                ₹{booking?.invoices?.total}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full sm:bg-white rounded-lg border overflow-auto">
          <div className="text-white bg-gray-600 flex flex-col sm:flex-row sm:rounded-none mb-2 sm:mb-0">
            <div className="p-3 text-left font-semibold">Description</div>
            <div className="p-3 text-left font-semibold">Quantity</div>
            <div className="p-3 text-left font-semibold">Unit Price</div>
            <div className="p-3 text-left font-semibold">Amount</div>
          </div>
          <div className="flex flex-col sm:flex-none">
            {booking.invoices?.items?.map((item, index) => (
              <div
                className="flex flex-col sm:flex-row mb-2 sm:mb-0 border-gray-300 border-b last:border-b-0 sm:border-none"
                key={index}
              >
                <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0">
                  {item.description}
                </div>
                <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0">
                  {item.quantity}
                </div>
                <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0">
                  ₹{item.unitPrice}
                </div>
                <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0">
                  ₹{item.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {booking.invoices?.status === "Invoice Rejected" ? (
          <p className="text-red-500 text-sm text-center mt-4">
            Invoice rejected
          </p>
        ) : booking.invoices?.status === "Invoice Accepted" ? (
          <div className="text-teal-500 text-sm mt-4 flex items-center justify-between">
            <div>Invoice accepted, Service will start soon! </div>
            {!booking.invoices.paid && (
              <Button
                variant="gradient"
                color="teal"
                className="rounded"
                loading={redirectingLoading}
                onClick={handleInvoicePayment}
              >
                Pay ₹{booking.invoices.total}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex gap-2 items-center mt-4 justify-end">
            <Button
              color="red"
              variant="gradient"
              onClick={handleRejectInvoice}
            >
              Reject
            </Button>
            <Button
              onClick={handleAcceptInvoice}
              color="teal"
              variant="gradient"
            >
              Accept
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default UserInvoiceDialog;
