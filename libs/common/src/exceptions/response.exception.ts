export class ResponseCodeMessage {
  public static readonly Ok = { code: '0000', message: 'OK' };
  public static readonly Cancelled = { code: '0001', message: 'CANCELLED' };
  public static readonly Unknown = { code: '0002', message: 'UNKNOWN' };
  public static readonly InvalidArgument = {
    code: '0003',
    message: 'INVALID_ARGUMENT',
  };
  public static readonly DeadlineExceeded = {
    code: '0004',
    message: 'DEADLINE_EXCEEDED',
  };
  public static readonly NotFound = { code: '0005', message: 'NOT_FOUND' };
  public static readonly AlreadyExists = {
    code: '0006',
    message: 'ALREADY_EXISTS',
  };
  public static readonly PermissionDenied = {
    code: '0007',
    message: 'PERMISSION_DENIED',
  };
  public static readonly ResourceExhausted = {
    code: '0008',
    message: 'RESOURCE_EXHAUSTED',
  };
  public static readonly FailedPrecondition = {
    code: '0009',
    message: 'FAILED_PRECONDITION',
  };
  public static readonly Aborted = { code: '0010', message: 'ABORTED' };
  public static readonly OutOfRange = { code: '0011', message: 'OUT_OF_RANGE' };
  public static readonly UnImplemented = {
    code: '0012',
    message: 'UNIMPLEMENTED',
  };
  public static readonly Internal = { code: '0013', message: 'INTERNAL' };
  public static readonly Unavailable = { code: '0014', message: 'UNAVAILABLE' };
  public static readonly DataLoss = { code: '0015', message: 'DATA_LOSS' };
  public static readonly Unauthenticated = {
    code: '0016',
    message: 'UNAUTHENTICATED',
  };
  public static readonly DefaultInternalError = {
    code: '9999',
    message: 'INTERNAL',
  };
}

export const DEFAULT_MESSAGE =
  '알 수 없는 오류가 발생 했습니다. 잠시 후 다시 시도해 주세요.';
