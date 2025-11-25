import { api } from "./api";

export interface Project {
    id: string;
    name: string;
    description?: string;
    dawType?: string;
    dawProjectPath?: string;
    userId: string;
    createdAt: string;
    tracks?: any[];
}

export interface createProjectDto {
    name: string;
    description?: string;
    dawType?: string;
    dawProjectPath?: string;
}

export interface updateProjectDto {
    name?: string;
    description?: string;
    dawType?: string;
    dawProjectPath?: string;
}

export const projectsService = {

    // recuperer tous les projects de l'utilisateur connecter 
getAll: async (): Promise<Project[]> => {
    return api.get('/projects');
},
// recuperer un project par son id
getById: async (id: string): Promise<Project> => {
    return api.get(`/projects/${id}`);
},
// creer un nouveau project
create: async (data: createProjectDto): Promise<Project> => {
    return api.post('/projects', data);
    },
// mettre a jour un project
update: async (id: string, data: updateProjectDto): Promise<Project> => {
    return api.put(`/projects/${id}`, data);
},
// supprimer un project
delete: async (id: string): Promise<void> => {
    return api.delete(`/projects/${id}`);
}
}