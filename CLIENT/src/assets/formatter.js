export const formatter = {
    format: (dateInput) => {
        if (!dateInput) return "Invalid date";
        try {
            const d = new Date(dateInput);

            const day = d.getDate();
            const month = d.toLocaleDateString("id-ID", { month: "long" });
            const year = d.getFullYear();

            const hours = d.getHours().toString().padStart(2, "0");
            const minutes = d.getMinutes().toString().padStart(2, "0");

            return `${day} ${month} ${year} pukul ${hours}.${minutes}`;
        } catch (e) {
            console.error("Error formatting date:", e, "Input was:", dateInput);
            return "Invalid date"; // Mengembalikan string jika terjadi error
        }
    },
};
