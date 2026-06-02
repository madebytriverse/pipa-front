#!/bin/bash

# 🚀 Script de deploy automático de develop → main

set -e  # Si ocurre un error, detiene la ejecución

echo "=== Cambiando a develop ==="
git checkout develop

echo "=== Ejecutando build ==="
npm run build

echo "=== Cambiando a main ==="
git checkout main

echo "=== Limpiando rama main (excepto .gitignore) ==="
# Guarda temporalmente el .gitignore si existe
if [ -f ".gitignore" ]; then
  cp .gitignore /tmp/.gitignore_backup
fi

# Elimina todo menos .git y .gitignore
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name '.gitignore' -exec rm -rf {} +

# Restaura el .gitignore si se guardó
if [ -f "/tmp/.gitignore_backup" ]; then
  mv /tmp/.gitignore_backup .gitignore
fi

echo "=== Copiando archivos de dist ==="
git checkout develop -- dist
cp -r dist/* .
rm -rf dist

echo "=== Haciendo commit y push ==="
git add .
git commit -m "🚀 Deploy automático desde develop"
git push origin main

echo "=== Volviendo a develop ==="
git checkout develop

echo "✅ Deploy completado correctamente"
