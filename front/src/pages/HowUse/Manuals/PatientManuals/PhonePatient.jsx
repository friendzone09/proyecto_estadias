function PhonePatient(){
    return(
        <>
        <article>
            <h1>1.- Registrarse e iniciar sesión</h1>

            <p>Bienvenido al sistema de consultas de citas para Ghamaris psicología, agradecemos su preferencia en poner su confianza en manos de nuestros psicólogos.</p>

            <p>
                Al ingresar por primera vez a nuestro sistema vera nuestra página de inicio con todos nuestros psicólogos disponibles. Para poder registrarte dirigete al 
                cabezero y da clic en el icono de las tres lineas úbicado en la parte derecha, al dar clic, se abira un menú latear, da clic en el texto "Iniciar sesión". Seras 
                dirigido a nuestro formulario para iniciar sesión. Si ya tienes una cuenta creada, coloca correctamente tu correo y contraseña para iniciar sesión. támbien 
                puedes hacerlo dando clic en el mismo texto ubicado en la parte inferior de la foto de cada uno de los psicólogos.
            </p>

            <p>Si aún no tienes una creada, da clic en el texto "Registrarse" en la parte inferior izquierda del formulario.</p>

            <p>Si no quieres registrarte por ti mismo envía un mensaje de WhatsApp al siguiente número:  <span className='underline_text'>2412231708</span>.</p>

            <p>Envia los siguientes datos para poder ser registrado:</p>

            <ul>
                <li>Nombre</li>
                <li>Apellidos</li>
                <li>Correo electrónico</li>
                <li>Número de celular</li>
                <li>Edad</li>
                <li>Psicólogo, fecha y hora de tu primer consulta. Si tu mismo quieres elegir a tu psicólogo y primer cita, especificalo</li>
                <li>Tipo de consulta: Individual, pareja, familiar u otro (especificalo)</li>
                <li>Contraseña</li>
            </ul>
            
            <p>Si deseas registrarte por ti mismo llena los campos requeridos. Sino, espera la confirmación de tu registro por parte del recepcionista.</p>
            
            <p className='important_text'>IMPORTANTE: La contraseña no puede ser modificada, procura recordarla.</p>

            <p>
                Una vez seas registrado seras dirigido al formulario para iniciar sesión (solo si tu te registraste, sino, da clic de nuevo en el texto "Inicia sesión"
                del menú desplegable o debajo de la foto de cualquier psicólogo). Llénalo con los datos previemente dados y da clic en el botón "Iniciar sesión".
            </p>

        </article>

        <article>
            <h1>2.- Agendar tu primer cita</h1>

            <p>Si enviaste mensaje de WhatsApp agendando tu primer cita, puedes omitir esta parte.</p>

            <p>
                Una vez estes dentro, el texto debajo de las fotos de los psicólogos cambiara ahora por "Agendar cita". Da clic en ese texto, esto te dirigira a la agenda del psicólogo
                seleccionado. En el calendario selecciona el día deseado, esto mostrara sus horas disponibles y no disponibles. Si no aparece ningua hora siginifica que el 
                psicólogo no trabaja ese día. Da clic en la hora del día seleccionado, esto abrira un cuadro de mensaje con la fecha y hora de la cita. Si quieres agendarla da clic en el
                botón azul "Agendar".
            </p>

            <p>
                Listo. Tú primer cita ah sido correctamente agendada.
            </p>

        </article>

        <article>
            <h1>3.- Agendar una nueva cita</h1>

            <p>Una vez pasada tu primer cita, podras reagendar una nueva siguiendo estos pasos:</p>

            <p>
                En el menú desplegable aparecera un nuevo texto llamado "Mi psicólogo". Da clic en este texto. Seras dirigido a la agenda de tu psicólogo. En el calendario selecciona el día 
                deseado, esto mostrara sus horas disponibles y no disponibles. Si no aparece ningua hora siginifica que el psicólogo no trabaja ese día. Da clic en la hora del 
                día seleccionado, esto abrira un cuadro de mensaje con la fecha y hora de la cita. Si quieres agendarla da clic en cualquiera de los dos botones verdes, solo elige con quien
                quieres agendarla, con tu psicólogo o con el recepcionista. Al dar clic será dirigido al número de WhatsApp de la persona seleccionada. Tranquilo, 
                automaticamente se escribirá un mensaje con tu nombre, fecha, hora y psicólogo (este ultimo solo si mandas el mensaje al recepcionista) para tu siguiente
                sesión. Si deseas modificar el mensaje hazlo, sino, simplemente envialo.
            </p>

            <p>Listo, solo es esperar que tu nueva cita sea agendada.</p>

            <p>
                En este apartado de "Mi psicólogo", en la parte superior del calendario, veras un texto donde se indica la fecha de tu siguiente
                sesión.
            </p>
        </article>
        </>
    )
}

export default PhonePatient