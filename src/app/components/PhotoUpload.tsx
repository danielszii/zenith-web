import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { useState } from 'react';

interface UploadFile {
  id: string;
  name: string;
  type: 'photo' | 'video';
  size: string;
}

export function PhotoUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop logic here
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] rounded-xl font-medium shadow-lg transition-all active:scale-95 z-50"
      >
        <Upload className="w-5 h-5" />
        Nova Postagem
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--background)] rounded-2xl border border-[var(--border)] w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">Nova Postagem</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-[var(--surface-glass-hover)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragActive
                ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                : 'border-[var(--border)] hover:border-[var(--muted)]'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[var(--muted)] rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-[var(--muted-foreground)]" />
              </div>
              <div>
                <p className="text-[var(--foreground)] font-medium mb-1">
                  Arraste e solte fotos ou vídeos aqui
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  ou clique para selecionar arquivos
                </p>
              </div>
              <button className="px-4 py-2 bg-[var(--surface-glass)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--foreground)] transition-all">
                Selecionar Arquivos
              </button>
            </div>
          </div>

          {/* Preview Files */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[var(--foreground)]">
                Arquivos selecionados ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-[var(--surface-glass)] border border-[var(--border)] rounded-xl"
                  >
                    <div className="w-10 h-10 bg-[var(--muted)] rounded-lg flex items-center justify-center flex-shrink-0">
                      {file.type === 'video' ? (
                        <Video className="w-5 h-5 text-[var(--muted-foreground)]" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-[var(--muted-foreground)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">{file.size}</p>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1.5 hover:bg-[var(--destructive)]/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-[var(--muted-foreground)] hover:text-[var(--destructive)]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Título
              </label>
              <input
                type="text"
                placeholder="Digite o título da postagem"
                className="w-full px-4 py-2.5 bg-[var(--surface-glass)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none focus:border-[var(--muted)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Descrição
              </label>
              <textarea
                rows={3}
                placeholder="Adicione uma descrição (opcional)"
                className="w-full px-4 py-2.5 bg-[var(--surface-glass)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none focus:border-[var(--muted)] transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Categoria
                </label>
                <select className="w-full px-4 py-2.5 bg-[var(--surface-glass)] border border-[var(--border)] rounded-xl text-[var(--foreground)] outline-none focus:border-[var(--muted)] transition-colors">
                  <option>Feminino</option>
                  <option>Masculino</option>
                  <option>Evento</option>
                  <option>Treino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Local
                </label>
                <input
                  type="text"
                  placeholder="Local do evento"
                  className="w-full px-4 py-2.5 bg-[var(--surface-glass)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none focus:border-[var(--muted)] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                className="w-4 h-4 rounded border-[var(--border)] bg-[var(--surface-glass)] checked:bg-[var(--primary)] checked:border-[var(--primary)]"
              />
              <label htmlFor="featured" className="text-sm text-[var(--foreground)] cursor-pointer">
                Marcar como destaque
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)]">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-[var(--surface-glass)] hover:bg-[var(--surface-glass-hover)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--foreground)] transition-all"
          >
            Cancelar
          </button>
          <button className="px-4 py-2 bg-[var(--primary)] hover:opacity-90 rounded-xl text-sm font-medium text-[var(--primary-foreground)] transition-all">
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
