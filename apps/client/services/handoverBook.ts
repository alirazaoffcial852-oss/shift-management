import http from "@workspace/ui/lib/http";

interface GetHandoverBooksParams {
  page?: number;
  limit?: number;
  shift_id?: number;
  usn_shift_id?: number;
  from_date?: string;
  to_date?: string;
  search?: string;
}

class HandoverBookService {
  async createHandoverBook(data: FormData) {
    return await http.post("/handover-books", data);
  }

  async getHandoverBooks(params: GetHandoverBooksParams) {
    let url = `/handover-books?page=${params.page || 1}&limit=${params.limit || 10}`;

    if (params.shift_id) {
      url += `&shift_id=${params.shift_id}`;
    }
    if (params.from_date) {
      url += `&from_date=${params.from_date}`;
    }
    if (params.to_date) {
      url += `&to_date=${params.to_date}`;
    }
    if (params.search) {
      url += `&search=${params.search}`;
    }

    return await http.get(url);
  }

  async getHandoverBookById(id: string) {
    return await http.get(`/handover-books/${id}`);
  }

  async updateHandoverBook(data: FormData, id: string) {
    return await http.put(`/handover-books/${id}`, data);
  }

  async deleteHandoverBook(id: string) {
    return await http.del(`/handover-books/${id}`);
  }

  async createUsnHandoverBook(data: FormData) {
    return await http.post("/usn-handover-books", data);
  }

  async getUsnHandoverBooks(params: GetHandoverBooksParams) {
    let url = `/usn-handover-books?page=${params.page || 1}&limit=${params.limit || 10}`;

    if (params.usn_shift_id) {
      url += `&usn_shift_id=${params.usn_shift_id}`;
    }
    if (params.from_date) {
      url += `&from_date=${params.from_date}`;
    }
    if (params.to_date) {
      url += `&to_date=${params.to_date}`;
    }
    if (params.search) {
      url += `&search=${params.search}`;
    }

    return await http.get(url);
  }

  async getUsnHandoverBookById(id: string) {
    return await http.get(`/usn-handover-books/${id}`);
  }

  async updateUsnHandoverBook(data: FormData, id: string) {
    return await http.put(`/usn-handover-books/${id}`, data);
  }

  async deleteUsnHandoverBook(id: string) {
    return await http.del(`/usn-handover-books/${id}`);
  }
}

export default new HandoverBookService();

