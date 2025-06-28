type Gallery = {
    id: string;
    title: string;
    category: string;
    isPrivate: boolean;
    accessCode: boolean;
    createdAt: string;
}

type ContactFormData = {
    name: string;
    email: string;
    service: string;
    message: string;
}

type Photo = {
    id: string;
    url: string;
    caption?: string;
    galleryId: string;
}

type Gallery = {
    id: string;
    title: string;
    isPrivate: boolean;
    accessCode?: string;
}