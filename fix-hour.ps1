# Script para corregir la visualización de hora en pileta/index.tsx
$file = "app\pileta\index.tsx"
$content = Get-Content $file -Raw

# Reemplazar el código de extracción manual de hora por toLocaleTimeString
$oldCode = @"
                  <Text style={styles.time}>
                    {registro.fechaHoraIngreso.split("T")[1].split(":")[0]}
                    :
                    {registro.fechaHoraIngreso.split("T")[1].split(":")[1]}
                  </Text>
"@

$newCode = @"
                  <Text style={styles.time}>
                    {new Date(registro.fechaHoraIngreso).toLocaleTimeString(
                      "es-AR",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </Text>
"@

$content = $content.Replace($oldCode, $newCode)
Set-Content $file -Value $content -NoNewline

Write-Host "Hora corregida exitosamente!" -ForegroundColor Green
