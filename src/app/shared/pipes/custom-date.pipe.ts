import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "customDate",
})
export class CustomDatePipe implements PipeTransform {
  transform(value: any): string {
    console.log("CustomDate pipe input:", value, "type:", typeof value);

    if (!value) {
      console.warn("CustomDate pipe: empty value");
      return "";
    }

    let date: Date;

    if (typeof value === "string") {
      if (value.includes("T") || value.includes("Z")) {
        date = new Date(value);
      } else if (value.includes("/") && value.split("/")[0].length === 2) {
        const parts = value.split("/");
        if (parts.length === 3) {
          // dd/MM/yyyy -> yyyy-MM-dd
          const day = parts[0];
          const month = parts[1];
          const year = parts[2];
          date = new Date(`${year}-${month}-${day}`);
        } else {
          date = new Date(value);
        }
      } else if (value.includes("/")) {
        date = new Date(value);
      } else {
        date = new Date(value);
      }
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) {
      console.error("CustomDate pipe: invalid date:", value);
      return value;
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }
}
