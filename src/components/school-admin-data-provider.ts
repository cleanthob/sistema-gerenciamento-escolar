import type { DataProvider, RaRecord } from "react-admin";

const endpoints: Record<string, string> = {
  users: "/api/staff",
  students: "/api/students",
  attendance: "/api/attendance",
  incidents: "/api/sanctions",
  payments: "/api/payments",
  grades: "/api/grades",
  lessons: "/api/lessons",
};

type ListParams = Parameters<DataProvider["getList"]>[1];
type ListResult = Awaited<ReturnType<DataProvider["getList"]>>;
type OneParams = Parameters<DataProvider["getOne"]>[1];
type OneResult = Awaited<ReturnType<DataProvider["getOne"]>>;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(payload.error ?? "A operação não foi concluída.");
  return payload as T;
}

function nestedValue(record: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, record);
}

function matchesFilter(record: RaRecord, filter: Record<string, unknown>) {
  return Object.entries(filter).every(([key, expected]) => {
    if (expected === undefined || expected === null || expected === "")
      return true;
    const actual = nestedValue(record as Record<string, unknown>, key);
    if (typeof actual === "string")
      return actual
        .toLocaleLowerCase("pt-BR")
        .includes(String(expected).toLocaleLowerCase("pt-BR"));
    return actual === expected;
  });
}

async function getList(
  resource: string,
  params: ListParams,
): Promise<ListResult> {
  const endpoint = endpoints[resource];
  if (!endpoint) throw new Error(`Recurso desconhecido: ${resource}`);

  const search = new URLSearchParams();
  const query = params.filter.q;
  if (typeof query === "string" && query.trim()) search.set("q", query.trim());
  if (params.filter.studentId)
    search.set("studentId", String(params.filter.studentId));
  if (params.filter.date) search.set("date", String(params.filter.date));
  const serverPaginated = resource === "students" || resource === "users";
  if (serverPaginated) {
    search.set("page", String(params.pagination?.page ?? 1));
    search.set("perPage", String(params.pagination?.perPage ?? 25));
    search.set("sort", params.sort?.field ?? "name");
    search.set("order", params.sort?.order ?? "ASC");
  }

  const response = await request<{ data: RaRecord[]; total: number }>(
    `${endpoint}${search.size ? `?${search}` : ""}`,
  );
  if (serverPaginated) return response as ListResult;

  let data = response.data.filter((record) =>
    matchesFilter(record, params.filter),
  );
  const sortField = params.sort?.field;
  if (sortField) {
    const direction = params.sort?.order === "DESC" ? -1 : 1;
    data = [...data].sort((first, second) => {
      const left = nestedValue(first as Record<string, unknown>, sortField);
      const right = nestedValue(second as Record<string, unknown>, sortField);
      return (
        String(left ?? "").localeCompare(String(right ?? ""), "pt-BR", {
          numeric: true,
        }) * direction
      );
    });
  }
  const total = data.length;
  const page = params.pagination?.page ?? 1;
  const perPage = params.pagination?.perPage ?? 25;
  return {
    data: data.slice((page - 1) * perPage, page * perPage),
    total,
  } as ListResult;
}

async function getOne(resource: string, params: OneParams): Promise<OneResult> {
  const endpoint = endpoints[resource];
  if (!endpoint) throw new Error(`Recurso desconhecido: ${resource}`);
  if (resource === "users") {
    const result = await request<{ data: RaRecord }>(
      `${endpoint}?id=${encodeURIComponent(String(params.id))}`,
    );
    return result as OneResult;
  }
  return request<{ data: RaRecord }>(
    `${endpoint}/${encodeURIComponent(String(params.id))}`,
  ) as Promise<OneResult>;
}

async function updateRecord(
  resource: string,
  id: string | number,
  data: Record<string, unknown>,
) {
  const endpoint = endpoints[resource];
  if (!endpoint) throw new Error(`Recurso desconhecido: ${resource}`);
  const url =
    resource === "payments"
      ? `${endpoint}?id=${encodeURIComponent(String(id))}`
      : `${endpoint}/${encodeURIComponent(String(id))}`;
  return request<{ data: RaRecord }>(url, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async function deleteRecord(resource: string, id: string | number) {
  const endpoint = endpoints[resource];
  if (!endpoint) throw new Error(`Recurso desconhecido: ${resource}`);
  return request<{ data: RaRecord }>(
    `${endpoint}/${encodeURIComponent(String(id))}`,
    { method: "DELETE" },
  );
}

const providerImplementation = {
  getList,
  getOne,
  getMany: async (
    resource: string,
    params: Parameters<DataProvider["getMany"]>[1],
  ) => {
    const records = await Promise.all(
      params.ids.map((id) =>
        getOne(resource, { id, meta: params.meta, signal: params.signal }),
      ),
    );
    return { data: records.map((record) => record.data) };
  },
  getManyReference: async (
    resource: string,
    params: Parameters<DataProvider["getManyReference"]>[1],
  ) =>
    getList(resource, {
      pagination: params.pagination,
      sort: params.sort,
      filter: { ...params.filter, [params.target]: params.id },
      meta: params.meta,
      signal: params.signal,
    } as ListParams),
  create: async (
    resource: string,
    params: Parameters<DataProvider["create"]>[1],
  ) => {
    const endpoint = endpoints[resource];
    if (!endpoint) throw new Error(`Recurso desconhecido: ${resource}`);
    return request<{ data: RaRecord }>(endpoint, {
      method: "POST",
      body: JSON.stringify(params.data),
    });
  },
  update: async (
    resource: string,
    params: Parameters<DataProvider["update"]>[1],
  ) =>
    updateRecord(resource, params.id, params.data as Record<string, unknown>),
  updateMany: async (
    resource: string,
    params: Parameters<DataProvider["updateMany"]>[1],
  ) => {
    await Promise.all(
      params.ids.map((id) =>
        updateRecord(resource, id, params.data as Record<string, unknown>),
      ),
    );
    return { data: params.ids };
  },
  delete: async (
    resource: string,
    params: Parameters<DataProvider["delete"]>[1],
  ) => deleteRecord(resource, params.id),
  deleteMany: async (
    resource: string,
    params: Parameters<DataProvider["deleteMany"]>[1],
  ) => {
    await Promise.all(params.ids.map((id) => deleteRecord(resource, id)));
    return { data: params.ids };
  },
};

export const adminDataProvider =
  providerImplementation as unknown as DataProvider;
