const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const { buildSchema } = require("graphql")
const { PrismaClient } = require("@prisma/client")

const app = express()
const prisma = new PrismaClient()

const schema = buildSchema(`
 type Query {
    hello: String 
    cours(id: Int!): Cours
    eleves(id: Int): Eleves
    horaires(id: Int!): Horaires
    matieres(id: Int!): Matieres
    notes(id: Int!): Notes
    plannings(id: Int!): Plannings
    profs(id: Int): Profs
    salles(id: Int!): Salles
    allcours: [Cours!]!
    allEleves: [Eleves!]!
    allHoraires: [Horaires!]!
    allMatieres: [Matieres!]!
    allNotes: [Notes!]!
    allPlannings: [Plannings!]!
    allProfs: [Profs!]!
    allSalles: [Salles!]!
    searchEleves(nom: String!): [Eleves!]!
    searchProfs(nom: String!): [Profs!]!
 }

 type Mutation {
    createCours(nom_prof: String!, debut: String!, fin: String!): Cours
    editCours(id: Int!, prof_id: Int,, debut: String, fin: String): Cours
    deleteCours(id: Int!): Boolean

    createEleve(nom: String! , prenom: String! , email: String! , promotion: String !): Eleves
    editEleve(id: Int!, nom: String, prenom: String, email: String, promotion: String): Eleves
    deleteEleve(id: Int!): Boolean

    createProf(nom: String! , prenom: String!, email: String !, nom_matiere: String! , description_matiere: String!): Profs
    editProf(id: Int!, nom: String, prenom: String, email: String, nom_matiere: String, description_matiere: String): Profs
    deleteProf(id: Int!): Boolean

    createNote(note: Float!, eleve_id: Int!, matiere_id: Int!): Notes
    editNote(id: Int!, note: Float, eleve_id: Int, matiere_id: Int): Notes
    deleteNote(id: Int!): Boolean

    createPlanning(date: String!, salle_id: Int!, cours_id: Int!, eleve_id: Int!): Plannings
    editPlanning(id: Int!, date: String, salle_id: Int, cours_id: Int, eleve_id: Int): Plannings
    deletePlanning(id: Int!): Boolean

    createSalle(nom: String!, batiment: String!): Salles
    editSalle(id: Int!, nom: String, batiment: String): Salles
    deleteSalle(id: Int!): Boolean

 }

 type Cours {
    id: Int!
    prof_id: Int!
    matiere_id: Int!
    horaire_id: Int!
    horaires: Horaires!
    matieres: Matieres!
    profs: Profs !
    plannings: [Plannings! ]!
 }

 type Eleves {
    id: Int!
    nom: String!
    prenom: String!
    email: String!
    promotion: String !
    notes: [Notes!]!
    plannings: [Plannings! ]!
 }

 type Horaires {
    id: Int!
    debut: String! 
    fin: String !
    cours: [Cours!]!
 }

 type Matieres {
    id: Int!
    nom: String!
    description: String
    cours: [Cours!]!
    notes: [Notes!]!
    profs: [Profs!]!
 }

 type Notes {
    id: Int !
    eleve_id: Int!
    matiere_id: Int!
    prof_id: Int!
    note: Float!
    profs: Profs!
    matieres: Matieres!
    eleves: Eleves!
 }

 type Plannings {
    id: Int!
    date: String!
    salle_id: Int!
    cours_id: Int!
    eleve_id: Int!
    salles: Salles!
    eleves: Eleves!
    cours: Cours!
 }

 type Profs {
    id: Int!
    nom: String!
    prenom: String!
    email: String!
    matiere_id: Int!
    cours: [Cours!]!
    notes: [Notes!]!
    matieres: Matieres!
 }

 type Salles {
    id: Int!
    nom: String!
    batiment: String!
    plannings: [Plannings!]!
 }
`)

const root = {
    hello: () => {
        return "hello word !!"
    },
    cours: async ({id}) => {
        return await prisma.cours.findUnique({ where: {id}, include: { horaires: true , matieres: true , profs: true } })
    },
    eleves: async ({id}) => {
        return await prisma.eleves.findUnique({    where: { id },
            include: {
              notes: {
                include: {
                  matieres: true,
                  profs: true,
                },
              },
            },})
    },
    horaires: async ({id}) => {
        return await prisma.horaires.findUnique({ where : {id}, include: { cours: true } })
    },
    matieres: async ({id}) => {
        return await prisma.matieres.findUnique({ where: {id}, include: { cours: true, profs: true , notes: true} })
    },
    notes: async ({id}) => {
        return await prisma.notes.findUnique({
            where: {
              id: 1
            },
            include: {
              profs: true,
              eleves: true,
              matieres: true
            }
          })
    },
    plannings: async ({id}) => {
        return await prisma.plannings.findUnique({    where: {
            id: id,
          },
          include: {
            salles: true,
            eleves: true,
            cours: {
              include: {
                horaires: true,
                matieres: true,
                profs: true,
              },
            },
          },})
    },
    profs: async ({ id }) => {
        return await prisma.profs.findUnique({ where: { id }, include: { matieres: true } });
      },
    salles: async ({id}) => {
        return await prisma.salles.findUnique({ where: {id}, include: { plannings: true } })
    },
    allcours: async () => {
        return await prisma.cours.findMany()
    },
    allEleves: async () => {
        return await prisma.eleves.findMany()
    },
    allHoraires: async () => {
        return await prisma.horaires.findMany()
    },
    allMatieres: async () => {
        return await prisma.matieres.findMany()
    },
    allNotes: async () =>{
        return await prisma.notes.findMany()
    },
    allPlannings: async () => {
        return await prisma.plannings.findMany()
    },
    allProfs: async () => {
        return await prisma.profs.findMany()
    },
    allSalles: async () => {
        return await prisma.salles.findMany()
    },
    searchEleves: async({ nom }) => {
        return await prisma.eleves.findMany({
            where: {
                nom: {
                    contains: nom
                }
            }
        })
    },

    searchProfs: async({ nom }) => {
        const profs = await prisma.profs.findMany({
            where: {
              nom: {
                contains: nom.toLowerCase(),
              },
            },
            include: {
              matieres: true,
            },
          });
          return profs.filter((prof) => prof.nom.toLowerCase().includes(nom.toLowerCase()));
    },

    createCours: async ({ nom_prof, debut, fin }) => {
        const prof = await prisma.profs.findFirst({
          where: { nom: nom_prof },
          include: { matieres: true },
        });
      
        if (!prof) {
          throw new Error("Professeur non trouvé");
        }
      
        const matiere_id = prof.matieres.id;
      
        const newHoraire = await prisma.horaires.create({
          data: {
            debut,
            fin,
          },
        });
      
        const newCours = await prisma.cours.create({
          data: {
            prof_id: prof.id,
            matiere_id,
            horaire_id: newHoraire.id,
          },
          include: {
            profs: true,
            matieres: true,
            horaires: true,
          },
        });
      
        return newCours;
      },

      editCours: async ({ id, prof_id, debut, fin}) =>{

        let uopdateData = {}

        if(prof_id){
            const prof = await prisma.profs.findUnique({ where: { id: prof_id}});
            if(!prof) throw new Error('Professeur introuvable')
            uopdateData.prof_id = prof.id
        }

        if(debut || fin){
            const cours = await prisma.cours.findUnique({ where: {id}, include: { horaires: true}})
            const horaire_id = cours.horaires.id

            await prisma.horaires.update({
                where: {id: horaire_id},
                data: { debut, fin }
            });
        }
        
        const updateCours = await prisma.cours.update({
            where: {id},
            data: uopdateData,
            include: {
                profs: true,
                matieres: true,
                horaires: true,
            },
        });

        return updateCours;
      },

      deleteCours: async ({ id }) => {
        const cours = await prisma.cours.findUnique({ where: {id}, include: { horaires: true}})

        if(!cours) {
            throw new Error("cours introuvable")
        }

        await  prisma.horaires.delete({ where: {id: cours.horaires.id}})

        const deleteCours = await prisma.cours.delete({ where: {id}})

        return deleteCours ? true : false
        },

        createEleve: async ({ nom, prenom, email, promotion}) => {
            const neweleve = await prisma.eleves.create({
                data: { nom, prenom, email, promotion}
            })

            return neweleve
        },

        editEleve: async ({ id, nom, prenom, email, promotion}) => {
            const updatedEleve = await prisma.eleves.update({
                where: { id } , data : { nom, prenom, email, promotion},
            });
            return updatedEleve
        },

        deleteEleve: async ({ id }) => {
            const deletedEleve = await prisma.eleves.delete({where: {id}})

            return deletedEleve ? true : false
        },

        createProf: async ({ nom, prenom, email, nom_matiere, description_matiere}) => {
            const newMatiere = await prisma.matieres.create({
                data: {
                    nom: nom_matiere,
                    description: description_matiere
                },
            });

            const newProf = await prisma.profs.create({
                data: {
                    nom, prenom, email, matiere_id: newMatiere.id
                }, include: {
                    matieres: true
                }
            });

            return newProf
        }, 

        editProf: async ({
            id,
            nom,
            prenom,
            email,
            nom_matiere,
            description_matiere,
          }) => {
            const prof = await prisma.profs.findUnique({
              where: { id },
              include: { matieres: true },
            });
          
            if (!prof) {
              throw new Error('Prof introuvable');
            }
          
            if (nom_matiere || description_matiere) {
              await prisma.matieres.update({
                where: { id: prof.matieres.id },
                data: {
                  nom: nom_matiere || prof.matieres.nom,
                  description: description_matiere || prof.matieres.description,
                },
              });
            }
          
            const updatedProf = await prisma.profs.update({
              where: { id },
              data: {
                nom: nom || prof.nom,
                prenom: prenom || prof.prenom,
                email: email || prof.email,
              },
              include: { matieres: true },
            });
          
            return updatedProf;
          },

          deleteProf: async ({id}) => {
            const profDelete = await prisma.profs.findUnique({
                where: {id},
                include: { matieres: true}
            });

            if(! profDelete){
                throw new Error('prof introuvable')
            }

            await prisma.notes.deleteMany({
                where: {prof_id: id},
            });

            await prisma.cours.findMany({
                where: {prof_id: id},
            });

            await prisma.matieres.delete({
                where: { id: profDelete.matieres.id },
              });
            
            const deletedProf = await prisma.profs.delete({
                where: { id },
            }); 

            return deletedProf ? true : false
          },
          
          createNote: async ({ note, eleve_id, matiere_id }) => {
            const matiere = await prisma.matieres.findUnique({ where: { id: matiere_id }, include: { profs: true } });
            const prof_id = matiere.profs[0].id;
        
            const newNote = await prisma.notes.create({
              data: {
                note,
                eleve_id,
                matiere_id,
                prof_id,
              },
            });
        
            return newNote;
          },
          
          editNote: async ({id, note, eleve_id, matiere_id}) => {
            const updatedNote = await prisma.notes.update({
                where: {id},
                data: {
                    note,
                    eleve_id, 
                    matiere_id
                }
            });

            return updatedNote
          },

          deleteNote: async ({id}) => {
            const deleteNote = await prisma.notes.delete({where: {id}})

            return deleteNote? true: false
          },

          createPlanning: async ({ date, salle_id, cours_id, eleve_id }) => {
            const newPlanning = await prisma.plannings.create({
              data: {
                date,
                salle_id,
                cours_id,
                eleve_id,
              },
            });
            return newPlanning;
          },

          editPlanning: async ({ id, date, salle_id, cours_id, eleve_id }) => {
            const updatedPlanning = await prisma.plannings.update({
              where: { id },
              data: {
                date: date || undefined,
                salle_id: salle_id || undefined,
                cours_id: cours_id || undefined,
                eleve_id: eleve_id || undefined,
              },
            });
            return updatedPlanning;
          },

        deletePlanning: async ({id}) => {
            const deletedPlanning = await prisma.plannings.delete({ where: {id}})

            return deletedPlanning ? true : false
        },
        
        createSalle: async ({ nom, batiment }) => {
            const newSalle = await prisma.salles.create({
              data: {
                nom,
                batiment,
              },
            });
            return newSalle;
          }, 

        editSalle: async ({id , nom , batiment}) => {
            const updateSalle = await prisma.salles.update({
                where: {id},
                data: {
                    nom,
                    batiment
                }
            });

            return updateSalle
        },

        deleteSalle: async ({id}) => {
            const deleteSalle = await prisma.salles.delete({
                where: {id}
            });

            return deleteSalle ? true : false
        }
          
          
}

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
      })
)

app.listen(4000, () => {
    console.log('Server running on port 4000');
  });