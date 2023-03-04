export interface AuthGuardTestOptions {
  extraChecks?: () => void;
}

export function ownerIdGuardTestCases(
  createRequest: any,
  options: AuthGuardTestOptions = {},
) {
  it('should return 403 when no header', async () => {
    const response = await createRequest();
    expect(response.status).toEqual(403);
    expect(response.body).toEqual({
      error: 'owner_id_required',
      message: 'Owner ID is required',
      statusCode: 403,
    });
    if (options.extraChecks) {
      options.extraChecks();
    }
  });
}
