import { Button, Dialog, IconButton, Input } from "@material-tailwind/react";
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "sonner";

const Invoice = ({ selectedBooking, setSelectedBooking }) => {
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [openCreateInvoiceDialog, setOpenCreateInvoiceDialog] = useState(false);

  const handleInvoiceDialog = () => setOpenInvoiceDialog(!openInvoiceDialog);
  const handleCreateInvoiceDialog = () =>
    setOpenCreateInvoiceDialog(!openCreateInvoiceDialog);

  const [disableTitleInput, setDisableTitleInput] = useState(false);

  const initialInvoice = {
    title: "",
    date: dayjs().format("YYYY-MM-DD"),
    time: dayjs().format("HH:mm"),
    items: [],
    total: 0,
  };

  const initialItem = {
    description: "",
    quantity: "",
    unitPrice: "",
    amount: 0,
    paid: false,
    status: "Not Accepted Yet!",
  };

  const [newInvoice, setNewInvoice] = useState(initialInvoice);
  const [newItem, setNewItem] = useState(initialItem);

  const handleAddItem = () => {
    const { description, quantity, unitPrice } = newItem;
    if (!description || !quantity || !unitPrice) {
      toast.error("Please fill in all fields for the item.");
      return;
    }
    const amount = parseFloat(quantity) * parseFloat(unitPrice);
    setNewInvoice((prevInvoice) => ({
      ...prevInvoice,
      items: [...prevInvoice.items, { ...newItem, amount }],
      total: parseFloat(prevInvoice.total) + amount,
    }));

    setNewItem(initialItem);
    if (newInvoice.title !== "") {
      setDisableTitleInput(true);
    }
  };

  const handleCreateInvoice = async () => {
    if (!newInvoice.title || newInvoice.items.length === 0) {
      toast.error(
        "Please fill in all fields for the invoice and add at least one item."
      );
      return;
    }
    try {
      const postData = {
        ...selectedBooking,
        invoices: newInvoice,
      };
      const response = await axios.put(
        `/api/bookings/${selectedBooking._id}`,
        postData
      );
      setSelectedBooking(response.data);
      toast.success("Invoice created successfully");
      handleCreateInvoiceDialog();
      setNewInvoice(initialInvoice);
      setDisableTitleInput(false);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Error creating invoice. Please try again.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-center gap-4">
      <div className="text-center text-xl text-gray-700">
        Create an invoice!
      </div>
      <Button color="blue" variant="gradient" onClick={handleInvoiceDialog}>
        Invoices
      </Button>
      <Dialog
        open={openInvoiceDialog}
        handler={handleInvoiceDialog}
        size="lg"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.1, y: 500 },
        }}
        className="bg-gray-100 max-h-[80vh] overflow-auto"
      >
        <div className="flex justify-between gap-2 flex-col lg:flex-row items-center mb-4 p-6">
          <h1 className="text-2xl font-bold">All Invoices</h1>
          <Button
            onClick={handleCreateInvoiceDialog}
            className="rounded"
            color="blue"
            variant="outlined"
          >
            Create New Invoice
          </Button>
          <Dialog
            open={openCreateInvoiceDialog}
            handler={handleCreateInvoiceDialog}
            size="lg"
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0.1, y: 500 },
            }}
            className="p-4 sm:p-6 max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]"
          >
            <div className="w-full">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-lg sm:text-xl font-medium text-blue-gray-500">
                  Create invoice
                </div>
                <IconButton
                  variant="text"
                  color="blue-gray"
                  onClick={handleCreateInvoiceDialog}
                  className="p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </IconButton>
              </div>
              <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <Input
                  label="Title - invoice for"
                  type="text"
                  value={newInvoice.title}
                  disabled={disableTitleInput}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      title: e.target.value,
                    })
                  }
                  fullWidth
                  color="blue"
                />
                <Input
                  label="Description"
                  type="text"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      description: e.target.value,
                    })
                  }
                  fullWidth
                  color="blue"
                />
              </div>
              <div className="flex flex-col sm:flex-row mb-4 gap-4">
                <div className="w-full sm:w-1/3">
                  <Input
                    label="Quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        quantity: e.target.value,
                      })
                    }
                    fullWidth
                    color="blue"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <Input
                    label="Unit Price"
                    type="number"
                    value={newItem.unitPrice}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        unitPrice: e.target.value,
                      })
                    }
                    fullWidth
                    color="blue"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <Button
                    onClick={handleAddItem}
                    color="blue"
                    variant="gradient"
                    className="rounded w-full"
                  >
                    Add item
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-4 max-h-64 overflow-auto">
                <div className="flex w-full justify-between items-center p-2 sm:p-4 bg-gray-700 text-white rounded-lg font-semibold text-xs sm:text-sm">
                  <div className="w-2/5">Description</div>
                  <div className="w-1/5 text-center">Quantity</div>
                  <div className="w-1/5 text-center">Unit Price</div>
                  <div className="w-1/5 text-center">Amount</div>
                </div>
                {newInvoice?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex w-full justify-between items-center p-2 sm:p-4 font-semibold text-gray-700 text-xs sm:text-sm"
                  >
                    <div className="w-2/5">{item.description}</div>
                    <div className="w-1/5 text-center">{item.quantity}</div>
                    <div className="w-1/5 text-center">₹{item.unitPrice}</div>
                    <div className="w-1/5 text-center">₹{item.amount}</div>
                  </div>
                ))}
                <div className="w-full h-px bg-gray-300"></div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleCreateInvoice}
                  className="rounded w-full sm:w-auto"
                  size="lg"
                  color="teal"
                  variant="gradient"
                >
                  Generate new invoice of ₹{newInvoice.total}
                </Button>
              </div>
            </div>
          </Dialog>
        </div>
        {selectedBooking.invoices?.title && (
          <div className="border p-4 bg-white rounded-lg m-0 md:m-6">
            <div className="flex justify-between items-start flex-col lg:flex-row mb-2 gap-2">
              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                  Title:
                  <div className="text-gray-700 font-medium">
                    {selectedBooking.invoices?.title}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  Date & Time:
                  <div className="text-gray-700 font-medium">
                    {selectedBooking.invoices?.date},{" "}
                    {selectedBooking.invoices?.time}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  Total:
                  <div className="text-gray-700 font-medium">
                    ₹{selectedBooking.invoices?.total}
                  </div>
                </div>
              </div>
              <div className="flex md:flex-col flex-row justify-center gap-2">
                {selectedBooking.invoices.status === "Invoice Accepted" ? (
                  <div className="bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-sm capitalize">
                    {selectedBooking.invoices.status}
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-800 rounded-full px-3 py-1 text-sm capitalize">
                    {selectedBooking.invoices.status}
                  </div>
                )}
                {selectedBooking.invoices.paid ? (
                  <div className="bg-teal-100 flex justify-center text-teal-800 rounded-full px-3 py-1 text-sm capitalize">
                    Paid
                  </div>
                ) : (
                  <div className="bg-red-100 flex justify-center text-red-800 rounded-full px-3 py-1 text-sm capitalize">
                    Not paid
                  </div>
                )}
              </div>
            </div>
            <div className="w-full sm:bg-white rounded-lg border overflow-auto">
              {/* Header */}
              <div className="text-white bg-teal-400 flex flex-col w-full sm:flex-row sm:rounded-none mb-2">
                <div className="p-3 text-left font-semibold flex justify-center md:w-1/4">Description</div>
                <div className="p-3 text-left font-semibold flex justify-center md:w-1/4">Quantity</div>
                <div className="p-3 text-left font-semibold flex justify-center md:w-1/4">Unit Price</div>
                <div className="p-3 text-left font-semibold flex justify-center md:w-1/4">Amount</div>
              </div>

              {/* Body */}
              <div className="flex flex-col">
                {selectedBooking.invoices?.items?.map((item, index) => (
                  <div
                    className="flex flex-col sm:flex-row mb-2 sm:mb-0 border-gray-300 border-b last:border-b-0"
                    key={index}
                  >
                    <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0 flex justify-center md:w-1/4">
                      {item.description}
                    </div>
                    <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0 flex justify-center md:w-1/4">
                      {item.quantity}
                    </div>
                    <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0 flex justify-center md:w-1/4">
                      ₹{item.unitPrice}
                    </div>
                    <div className="border-grey-light border-b sm:border-none p-3 truncate last:border-b-0 flex justify-center md:w-1/4">
                      ₹{item.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Invoice;
