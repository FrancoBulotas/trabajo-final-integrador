

Contraseña de DataBase de firebase: 114440


- Cada vez que cambiamos codigo y queremos verlo en apk nuevo hacemos:
ionic build
npx cap copy android
npx cap sync android
cd android
./gradlew clean (usar solo si hay problemas de cache)
./gradlew assembleDebug


o todos juntos ionic build && npx cap copy android && ./gradlew assembleDebug


cordova-res android --skip-config --copy
