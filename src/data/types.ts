interface PlaylistCoverImage {
  height: number
  url: string
  width: number
}
interface PlaylistTrackInfo {
  href: string
  total: number
}
export interface Playlist {
  id: string
  images: PlaylistCoverImage[]
  name: string
  owner_name: string
  is_public: boolean
  tracks: PlaylistTrackInfo
}
