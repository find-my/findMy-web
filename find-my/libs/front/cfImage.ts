export const CFImageUrl = (id: string, variant: string = 'public'): string =>
  `https://imagedelivery.net/lYEA_AOTbvtd1AYkvFp-oQ/${id}/${variant}`;

export async function uploadCFImage(file: FileList | [], userId: number): Promise<string | null> {
  if (!file) return null;
  const { uploadURL } = await (await fetch(`/api/files`)).json();
  const form = new FormData();
  form.append('file', file[0], userId + '');
  const {
    result: { id },
  } = await (
    await fetch(uploadURL, {
      method: 'POST',
      body: form,
    })
  ).json();

  return id;
}
export const deleteCFImage = async (deleteFileId: string) => {
  await (
    await fetch(`/api/files`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deleteFileId }),
    })
  ).json(); //삭제 처리 되었는지 확인 필요
};
