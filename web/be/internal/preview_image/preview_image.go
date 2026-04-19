package previewimage

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"os/exec"
	"strings"

	. "sweetseek-be/internal/types"
)

const (
	structuresDir = "./data/structures"
	previewImgDir    = "./data/img/preview"
	molrenderOutputFormat = "%s_model-1.jpeg"
)

func GenerateImages(data []ComputedStructure) error {
	slog.Info("Generating preview images")
	if err := os.MkdirAll(structuresDir, 0755); err != nil {
		return fmt.Errorf("failed to create structures directory: %w", err)
	}
	if err := os.MkdirAll(previewImgDir, 0755); err != nil {
		return fmt.Errorf("failed to create preview image directory: %w", err)
	}

	molrenderCmd := os.Getenv("MOLRENDER_CMD")
	if molrenderCmd == "" {
		return fmt.Errorf("MOLRENDER_CMD environment variable is not set")
	}

	for _, structure := range data {
		if err := downloadStructure(structure.PdbId); err != nil {
			return err
		}
		if err := renderStructure(molrenderCmd, structure.PdbId); err != nil {
			return err
		}
	}

	return nil
}

func downloadStructure(pdbId string) error {
	filePath := fmt.Sprintf("%s/%s.bcif", structuresDir, pdbId)

	if _, err := os.Stat(filePath); err == nil {
		return nil
	}

	slog.Debug("Structure not cached", "pdbid", pdbId)

	url := fmt.Sprintf("https://models.rcsb.org/%s.bcif", pdbId)

	resp, err := http.Get(url)
	if err != nil {
		return fmt.Errorf("failed to download %s: %w", url, err)
	}
	defer resp.Body.Close()

	out, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("failed to create file %s: %w", filePath, err)
	}
	defer out.Close()

	if _, err := io.Copy(out, resp.Body); err != nil {
		return fmt.Errorf("failed to save file %s: %w", filePath, err)
	}

	return nil
}


func renderStructure(molrenderCmd, pdbId string) error {
	newPath := fmt.Sprintf("%s/%s.jpeg", previewImgDir, pdbId)
	if _, err := os.Stat(newPath); err == nil {
		return nil
	}
	slog.Debug("Rendering image", "pdbid", pdbId)

	filePath := fmt.Sprintf("%s/%s.bcif", structuresDir, pdbId)
	var cmd *exec.Cmd
	commonArgs := []string{"model", "--plddt", "on", "--format", "jpeg", "--width", "300", "--height", "300", filePath, previewImgDir, "0"}
	parts := strings.Split(molrenderCmd, ";")
	var args []string
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			args = append(args, trimmed)
		}
	}
	args = append(args, commonArgs...)
	cmd = exec.Command(args[0], args[1:]...)
	if out, err := cmd.CombinedOutput(); err != nil {
		return fmt.Errorf("molrender failed for %s: %w\n%s", pdbId, err, out)
	}

	oldPath := fmt.Sprintf("%s/%s", previewImgDir, fmt.Sprintf(molrenderOutputFormat, pdbId))
	err := os.Rename(oldPath, newPath)
	if err != nil {
		return err
	}

	return nil
}

