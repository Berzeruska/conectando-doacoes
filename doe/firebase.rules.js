// ============================================================
// REGRAS DE SEGURANÇA – FIRESTORE
// Cole em: Firebase Console > Firestore > Rules
// ============================================================

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuários: só lê/escreve seus próprios dados
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId
                    && request.resource.data.tipo in ['doador', 'instituicao'];
      allow update: if request.auth != null && request.auth.uid == userId;
    }

    // Anúncios
    match /anuncios/{anuncioId} {
      // Qualquer autenticado pode listar/ler
      allow read: if request.auth != null;

      // Criar: apenas doadores
      allow create: if request.auth != null
                    && isDoador()
                    && request.resource.data.doadorId == request.auth.uid
                    && request.resource.data.status == 'disponível';

      // Editar conteúdo: somente o dono do anúncio
      allow update: if request.auth != null && (
        // Doador editando seu próprio anúncio
        (resource.data.doadorId == request.auth.uid) ||
        // Instituição reservando (muda status e adiciona instituicaoId)
        (isInstituicao()
          && resource.data.status == 'disponível'
          && request.resource.data.status == 'reservado')
      );

      // Excluir: somente o dono
      allow delete: if request.auth != null
                    && resource.data.doadorId == request.auth.uid;
    }

    // Conversas
    match /conversas/{conversaId} {
      allow read: if request.auth != null
                  && (resource.data.doadorId == request.auth.uid
                      || resource.data.instituicaoId == request.auth.uid);

      allow create: if request.auth != null && isInstituicao()
                    && request.resource.data.instituicaoId == request.auth.uid;

      allow update: if request.auth != null
                    && (resource.data.doadorId == request.auth.uid
                        || resource.data.instituicaoId == request.auth.uid);
    }

    // Helper functions
    function isDoador() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tipo == 'doador';
    }
    function isInstituicao() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tipo == 'instituicao';
    }
  }
}


// ============================================================
// REGRAS DE SEGURANÇA – REALTIME DATABASE
// Cole em: Firebase Console > Realtime Database > Rules
// ============================================================

/*
{
  "rules": {
    "conversas": {
      "$conversaId": {
        ".read": "auth != null && (
          root.child('conversas').child($conversaId).child('doadorId').val() == auth.uid ||
          root.child('conversas').child($conversaId).child('instituicaoId').val() == auth.uid
        )",
        "mensagens": {
          "$mensagemId": {
            ".write": "auth != null && (
              root.child('conversas').child($conversaId).child('doadorId').val() == auth.uid ||
              root.child('conversas').child($conversaId).child('instituicaoId').val() == auth.uid
            )",
            ".validate": "newData.hasChildren(['texto', 'remetenteId', 'timestamp'])
              && newData.child('remetenteId').val() == auth.uid
              && newData.child('texto').isString()
              && newData.child('texto').val().length > 0
              && newData.child('texto').val().length <= 2000"
          }
        }
      }
    }
  }
}
*/


// ============================================================
// REGRAS DE SEGURANÇA – STORAGE
// Cole em: Firebase Console > Storage > Rules
// ============================================================

/*
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /anuncios/{imagemId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/(jpeg|png)');
      allow delete: if request.auth != null;
    }
  }
}
*/
