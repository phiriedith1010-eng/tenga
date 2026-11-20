export const RIDER_DESK_CODE = "2468";

export function riderAuthorized(request: Request) {
  return request.headers.get("x-demo-rider") === RIDER_DESK_CODE;
}
