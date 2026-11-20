export function resolveGroupForImage({ id, relativePath, folderGroup, captionGroup, assignments = {}, validGroups = [] }) {
  const group = assignments[id] ?? assignments[relativePath] ?? captionGroup ?? folderGroup;
  if (group && !validGroups.includes(group)) throw new Error(`Unknown gallery group "${group}" for ${relativePath ?? id}.`);
  return group || undefined;
}

export function resolveGroupMetadata(groups, images, coverAssets = {}) {
  const galleryImages = images.filter((image) => image.id.startsWith("gallery-"));
  const resolved = groups.map((group) => {
    const photos = galleryImages.filter((image) => image.group === group.id);
    const fallbackCover = photos.find((image) => image.featured) ?? photos[0];
    const { coverSource: _coverSource, ...metadata } = group;
    const coverImage = coverAssets[group.id] ?? fallbackCover ?? null;
    const { files: _files, ...publicCoverImage } = coverImage ?? {};
    return {
      ...metadata,
      count: new Set(photos.map((image) => image.sourceHash)).size,
      coverImage: coverImage ? publicCoverImage : null,
    };
  });
  const unassigned = galleryImages.filter((image) => !image.group);
  return { groups: resolved, unassigned };
}
